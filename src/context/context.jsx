/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";
import {
  Native,
  ChainId,
  CurrencyAmount,
  TradeType,
  Percent,
  ERC20Token,
  WBNB,
} from "@pancakeswap/sdk";
import {
  getContract,
  readContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import {
  SmartRouter,
  SMART_ROUTER_ADDRESSES,
  SwapRouter,
} from "@pancakeswap/smart-router";
import { bscTokens } from "@pancakeswap/tokens";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  WagmiConfig,
  createConfig,
  useAccount,
  useConnect,
  useSwitchNetwork,
  useNetwork,
  useSendTransaction,
} from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { createPublicClient, hexToBigInt, http } from "viem";
import { bsc } from "viem/chains";
import { GraphQLClient } from "graphql-request";

export const appContext = createContext({});

const ContextProvider = ({ children }) => {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { switchNetwork } = useSwitchNetwork();
  const { sendTransactionAsync } = useSendTransaction();
  let a = new ERC20Token(
    ChainId.BSC,
    "0xcf28Bd157c43fEA7CfDc5B8E2B480e1CF9aC66dA",
    18,
    "CG8",
    "CGATE",
    "https://www.binance.com/"
  );
  let swapFrom = a;
  let swapTo = bscTokens.usdc;

  const [trade, setTrade] = useState();

  const chainId = ChainId.BSC;

  const publicClient = createPublicClient({
    chain: bsc,
    transport: http("https://bsc-dataseed1.binance.org"),
    batch: {
      multicall: {
        batchSize: 1024 * 200,
      },
    },
  });

  const v3SubgraphClient = new GraphQLClient(
    "https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc"
  );
  const v2SubgraphClient = new GraphQLClient(
    "https://proxy-worker-api.pancakeswap.com/bsc-exchange"
  );

  const quoteProvider = SmartRouter.createQuoteProvider({
    onChainProvider: () => publicClient,
  });

  function calculateGasMargin(value, margin = 1000n) {
    return (value * (10000n + margin)) / 10000n;
  }

  //Trade Type 0->Exact input  1->ExactOutput

  const getBestRoute = useCallback(async (_amount, _swapFrom, tradeType) => {
    if (_swapFrom == "CG8") {
      swapFrom = a;
      swapTo = bscTokens.usdc;
    } else {
      swapFrom = bscTokens.usdc;
      swapTo = a;
    }
    console.log("swap from and to is---->", swapFrom, swapTo);

    const amount = CurrencyAmount.fromRawAmount(swapFrom, _amount * 10 ** 18);
    const [v2Pools, v3Pools] = await Promise.all([
      SmartRouter.getV2CandidatePools({
        onChainProvider: () => publicClient,
        v2SubgraphProvider: () => v2SubgraphClient,
        v3SubgraphProvider: () => v3SubgraphClient,
        currencyA: swapFrom,
        currencyB: swapTo,
      }),
      SmartRouter.getV3CandidatePools({
        onChainProvider: () => publicClient,
        subgraphProvider: () => v3SubgraphClient,
        currencyA: amount.currency,
        currencyB: swapTo,
        subgraphFallback: false,
      }),
    ]);
    const pools = [...v2Pools, ...v3Pools];
    const trade = await SmartRouter.getBestTrade(amount, swapTo, tradeType, {
      gasPriceWei: () => publicClient.getGasPrice(),
      maxHops: 2,
      maxSplits: 2,
      poolProvider: SmartRouter.createStaticPoolProvider(pools),
      quoteProvider,
      quoterOptimization: true,
    });
    console.log("trade is------>", trade);
    return trade;
  }, []);

  const swapCallParams = (_address, _trade) => {
    console.log("in call params", _address);
    if (!_trade) {
      return null;
    }
    console.log("in call params22222----->>", _trade);
    const { value, calldata } = SwapRouter.swapCallParameters(_trade, {
      recipient: _address,
      slippageTolerance: new Percent(1),
    });
    console.log("value and call data is", value, calldata);
    return {
      address: SMART_ROUTER_ADDRESSES[chainId],
      calldata,
      value,
    };
  };

  const swap = async (_address, _trade) => {
    try {
      console.log("swap function is called---->");
      if (!_address) {
        return;
      }
      console.log("here----->");

      const {
        value,
        calldata,
        address: routerAddress,
      } = swapCallParams(_address, _trade);
      console.log("value is-------->", value);

      const tx = {
        account: _address,
        to: routerAddress,
        data: calldata,
        value: hexToBigInt(value),
      };
      const gasEstimate = await publicClient.estimateGas(tx);
      let res = await sendTransactionAsync({
        account: _address,
        chainId,
        to: routerAddress,
        data: calldata,
        value: hexToBigInt(value),
        gas: calculateGasMargin(gasEstimate),
      });
      const res1 = await waitForTransaction({
        hash: res?.hash,
      });
      return res1;
    } catch (e) {
      console.log("err is---->", e);
      return false;
    }
  };

  useEffect(() => {
    try {
      getBestRoute(1,"CG8", 0).then((trade) => {
        console.log("trade in my context is----->",trade);
        setTrade(trade);
      });
    } catch (e) {
      console.log("error in route e---->", e);
    }
  }, []);

  const value = {
    trade,
    getBestRoute,
    swap,
  };
  return <appContext.Provider value={value}>{children}</appContext.Provider>;
};

export default ContextProvider;
