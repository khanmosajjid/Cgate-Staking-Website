/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getContract,
  readContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import {
  TOKEN_CONTRACT,
  STAKING_CONTRACT,
  USDC_CONTRACT,
  PANCAKE_TEST_FACTORY_CONTRACT,
  PANCAKE_TEST_ROUTER_CONTRACT,
} from "../constants/contracts";
import StakingABI from "../constants/stakingAbi.json";
import PairABI from "../constants/pairABI.json";
import FactoryABI from "../constants/factoryABI.json";
import RouterABI from "../constants/routerABI.json";
import { ethers } from "ethers";
import usdcABI from "../constants/usdcABI.json";
import TokenABI from "../constants/tokenABI.json";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { emitter } from "./eventEmitter";
import { addDepositHistory } from "./apiServices";
import { useNavigate } from "react-router-dom";

export const stakingContract = async () => {
  const contract = getContract({
    address: STAKING_CONTRACT,
    abi: StakingABI,
    //   walletClient,
  });

  const data = await readContract({
    address: STAKING_CONTRACT,
    abi: StakingABI,
    functionName: "admin",
  });
};

export const convertEpochToLocalTime = (epochTimestamp) => {
  try {
    const date = new Date(epochTimestamp * 1000);
    return date.toLocaleString();
  } catch (e) {
    console.log("errror in convert epoch time is--->", e);
  }
};
export const daysBetweenEpochAndNow = (epochTimestamp) => {
  try {
    var startDate: any = new Date(epochTimestamp * 1000);

    var currentDate: any = new Date();

    var diffInMilliseconds = currentDate - startDate;

    var diffInDays = diffInMilliseconds / (24 * 60 * 60 * 1000);

    return Math.abs(diffInDays);
  } catch (e) {
    console.log("errror in convert epoch time is--->", e);
  }
};

export const convertToEther = (amount) => {
  try {
    const balanceInWeiBigInt = amount;
    const balanceInWeiBigNumber = ethers.BigNumber.from(
      balanceInWeiBigInt.toString()
    );

    const balanceInEther = ethers.utils.formatEther(balanceInWeiBigNumber);

    return balanceInEther;
  } catch (e) {
    console.log("error is---->", e);
    return 0;
  }
};

export const convertToWei = (amount) => {
  try {
    const balanceInWeiBigInt = amount;
    const balanceInEther = ethers.utils.parseEther(balanceInWeiBigInt);

    return balanceInEther;
  } catch (e) {
    console.log("error is---->", e);
  }
};

export const cGateBalance = async (account) => {
  try {
    const data = await readContract({
      address: TOKEN_CONTRACT,
      abi: TokenABI,
      functionName: "balanceOf",
      args: [account],
    });

    return convertToEther(data);
  } catch (e) {
    console.log("error is----->", e);
  }
};
export const getUsdcBalance = async (account) => {
  try {
    const data = await readContract({
      address: USDC_CONTRACT,
      abi: usdcABI,
      functionName: "balanceOf",
      args: [account],
    });
    console.log("data is------>", convertToEther(data));

    return convertToEther(data);
  } catch (e) {
    console.log("error is----->", e);
  }
};

export const getBalance = async (account, contract, abi) => {
  try {
    const data = await readContract({
      address: contract,
      abi: abi,
      functionName: "balanceOf",
      args: [account],
    });
    console.log("data is------>", convertToEther(data));

    return convertToEther(data);
  } catch (e) {
    console.log("error is----->", e);
  }
};
export const getTotalPoolsCount = async () => {
  try {
    const data = await readContract({
      address: STAKING_CONTRACT,
      abi: StakingABI,
      functionName: "getTotalPoolsCount",
    });

    return Number(data);
  } catch (e) {
    console.log("error is---->", e);
  }
};

export const poolsDetails = async (account) => {
  try {
    const pools: any = [];
    const noOfPools: any = await getTotalPoolsCount();
    for (let i = 0; i < noOfPools; i++) {
      const data: any = await readContract({
        address: STAKING_CONTRACT,
        abi: StakingABI,
        functionName: "pools",
        args: [i],
      });

      const userDeposit = await getUserStakePerPool(account, i);
      data.push(userDeposit);

      if (data[5] == true) {
        const pendingReward = await getPendingRewardForPool(i, account);
        data.push(pendingReward);
        const withdrawAmount = await getTotalWithdrawAllowedForPool(i, account);
        data.push(withdrawAmount);

        pools[i] = data;
      }
    }
    return pools;
  } catch (e) {
    console.log("error in no of pools is--->", e);
  }
};

export const getPoolDetailsWithPoolId = async (account, poolId) => {
  try {
    const pools: any = [];
    console.log("pool id is---->", poolId);

    const noOfPools: any = await getTotalPoolsCount();
    console.log("no of pools is---->", noOfPools);

    const data: any = await readContract({
      address: STAKING_CONTRACT,
      abi: StakingABI,
      functionName: "pools",
      args: [poolId],
    });

    const userDeposit = await getUserStakePerPool(account, poolId);
    console.log("user deposit is---->", userDeposit);
    data.push(userDeposit);

    const pendingReward = await getPendingRewardForPool(poolId, account);
    data.push(pendingReward);
    const withdrawAmount = await getTotalWithdrawAllowedForPool(
      poolId,
      account
    );
    data.push(withdrawAmount);

    pools[0] = data;
    console.log("complete pools details is----->", pools);
    return pools;
  } catch (e) {
    console.log("error in no of pools is--->", e);
  }
};

export const userDetails = async (address) => {
  try {
    const data = await readContract({
      address: STAKING_CONTRACT,
      abi: StakingABI,
      functionName: "users",
      args: [address],
    });

    console.log("user data is---->", data);
    return data;
  } catch (e) {
    console.log("error is---->", e);
  }
};

export const getPair = async (tokenA, tokenB) => {
  try {
    const data = await readContract({
      address: PANCAKE_TEST_FACTORY_CONTRACT,
      abi: FactoryABI,
      functionName: "getPair",
      args: [tokenA, tokenB],
    });
    console.log("data of get pair is------->",data)

    return data;
  } catch (e) {
    console.log("error is---->", e);
  }
};

export const getReserve = async (tokenA, tokenB) => {
  try {
    const pairContract: any = await getPair(tokenA, tokenB);

    const data = await readContract({
      address: pairContract,
      abi: PairABI,
      functionName: "getReserves",
    });
    console.log("data of get reserve is------>",data)

    return data;
  } catch (e) {
    console.log("error is---->", e);
  }
};

export const getAmountOut = async (amountIn, tokenA, tokenB) => {
  try {
    amountIn = convertToWei(amountIn);

    let data: any = await readContract({
      address: PANCAKE_TEST_ROUTER_CONTRACT,
      abi: RouterABI,
      functionName: "getAmountsOut",
      args: [amountIn, [tokenA, tokenB]],
    });

    data = convertToEther(data[1]);
    console.log("amount out data is----->", data);
    return parseFloat(data)?.toFixed(2);
  } catch (e) {
    console.log("error in---->", e);
    return 0;
  }
};
export const getAmountIn = async (amountIn, tokenA, tokenB) => {
  try {
    amountIn = convertToWei(amountIn);

    let data: any = await readContract({
      address: PANCAKE_TEST_ROUTER_CONTRACT,
      abi: RouterABI,
      functionName: "getAmountsIn",
      args: [amountIn, [tokenA, tokenB]],
    });
    data = convertToEther(data[0]);
    console.log("input amount is----->", parseFloat(data));

    return parseFloat(data)?.toFixed(2);
  } catch (e) {
    console.log("error in---->", e);
    return 0;
  }
};
export const getMinAmountOut = async (amountIn) => {
  try {
    const reserve: any = await getReserve(USDC_CONTRACT, TOKEN_CONTRACT);
    amountIn = convertToWei(amountIn);

    let data = await readContract({
      address: PANCAKE_TEST_ROUTER_CONTRACT,
      abi: RouterABI,
      functionName: "getAmountOut",
      args: [amountIn, reserve[0], reserve[1]],
    });
    console.log("data is----->", data);
    data = data.toString();
    data = convertToEther(data);

    return data;
  } catch (e) {
    console.log("error in---->", e);
    return 0;
  }
};
export const getMinAmountIn = async (amountOut) => {
  try {
    const reserve: any = await getReserve(USDC_CONTRACT, TOKEN_CONTRACT);
    amountOut = convertToWei(amountOut);
    let data = await readContract({
      address: PANCAKE_TEST_ROUTER_CONTRACT,
      abi: RouterABI,
      functionName: "getAmountIn",
      args: [amountOut, reserve[0], reserve[1]],
    });
    console.log("get minm amount in data is----->", data);
    data = data.toString();
    data = convertToEther(data);

    return data;
  } catch (e) {
    console.log("error in---->", e);
    return 0;
  }
};

export const buyCG8 = async (amountIn, tokenA, tokenB, to) => {
  try {
    console.log("amount in is---->", amountIn);

    let amountOut = await getMinAmountIn(amountIn);
    amountOut = convertToWei(amountOut.toString());
    console.log("amount out is---->", amountOut);
    amountIn = convertToWei(amountIn.toString());
    amountIn = amountIn.toString();

    const deadline = 2014960015;
    const data = await writeContract({
      address: PANCAKE_TEST_ROUTER_CONTRACT,
      abi: RouterABI,
      functionName: "swapTokensForExactTokens",
      args: [amountIn, amountOut, [tokenA, tokenB], to, deadline],
    });
    console.log("data of swap is------>", data);
    const res: any = await waitForTransaction({
      hash: data?.hash,
    });
    console.log("after transactin finished", res);
    return res;
  } catch (e) {
    const detailsIndex = e?.message.indexOf("Details:");
    const detailsPart = e?.message.substring(detailsIndex);

    toast.error(detailsPart);
  }
};
export const buyUsdc = async (amountIn, tokenA, tokenB, to) => {
  try {
    console.log("amount in tokenA tokenB value is", amountIn);

    let amountOut: any = await getAmountOut(
      amountIn,
      USDC_CONTRACT,
      TOKEN_CONTRACT
    );
    amountOut = convertToWei(amountOut);
    console.log("amount out is---->", amountOut);
    amountIn = convertToWei(amountIn);
    console.log("input amount is--->", amountIn);
    const deadline = 2014960015;
    const data = await writeContract({
      address: PANCAKE_TEST_ROUTER_CONTRACT,
      abi: RouterABI,
      functionName: "swapExactTokensForTokens",
      args: [
        amountIn.toString(),
        amountOut.toString(),
        [tokenA, tokenB],
        to,
        deadline,
      ],
    });
    console.log("data of swap is------>", data);
    const res: any = await waitForTransaction({
      hash: data?.hash,
    });
    console.log("after transactin finished", res);
    return res;
  } catch (e) {
    console.log("error in usdc buy is", e);
    const detailsIndex = e?.message.indexOf("Details:");
    const detailsPart = e?.message.substring(detailsIndex);

    toast.error(detailsPart);
  }
};

export const checkAllowance = async (
  account,
  spenderContract,
  contract,
  abi
) => {
  try {
    const data = await readContract({
      address: contract,
      abi: abi,
      functionName: "allowance",
      args: [account, spenderContract],
    });

    return convertToEther(data);
  } catch (e) {
    console.log("error is----->", e);
  }
};

export const approveToken = async (account, spenderContract, contract, abi) => {
  let amount: any = await getBalance(account, contract, abi);
  console.log("amount to approve is---->", amount);
  amount = convertToWei(amount);
  try {
    const data = await writeContract({
      address: contract,
      abi: abi,
      functionName: "approve",
      args: [spenderContract, amount],
    });
    console.log("data of allowance is------>", convertToEther(data));
    const res: any = await waitForTransaction({
      hash: data?.hash,
    });
    console.log("after transactin finished", res);
    return res;
  } catch (e) {
    toast.error(e.message);
  }
};

//Staking Functions

export const getPendingRewardForPool = async (poolId, account) => {
  try {
    const noOfPools: any = await getTotalPoolsCount();
    let amount: any = 0;

    const data: any = await readContract({
      address: STAKING_CONTRACT,
      abi: StakingABI,
      functionName: "getTotalPendingRewardsForPool",
      args: [poolId, account],
    });
    amount = parseFloat(convertToEther(data).toString());

    if (amount) {
      return amount;
    } else {
      return 0;
    }
  } catch (e) {
    return 0;
  }
};

export const getUsdcToClaimed = async (account) => {
  try {
    const noOfPools: any = await getTotalPoolsCount();
    let amount: any = 0;
    for (let i = 0; i < noOfPools; i++) {
      const res = await isPoolActive(i);
      if (res) {
        const data: any = await readContract({
          address: STAKING_CONTRACT,
          abi: StakingABI,
          functionName: "getTotalPendingRewardsForPool",
          args: [i, account],
        });

        amount =
          parseFloat(amount) + parseFloat(convertToEther(data).toString());
      }
    }

    return amount;
  } catch (e) {
    const detailsIndex = e?.message.indexOf("Details:");
    const detailsPart = e?.message.substring(detailsIndex);

    toast.error(detailsPart);
  }
};

export const stake = async (poolId, amount, referrer) => {
  try {
    amount = convertToWei(amount);
    console.log("amount to stake is---->", poolId);
    const data = await writeContract({
      address: STAKING_CONTRACT,
      abi: StakingABI,
      functionName: "stake",
      args: [poolId, amount, referrer],
    });
    console.log("data is----->", data);
    const res: any = await waitForTransaction({
      hash: data?.hash,
    });

    console.log("after transaction finished", res);
    return res;
  } catch (e) {
    const detailsIndex = e?.message.indexOf("Details:");
    const detailsPart = e?.message.substring(detailsIndex);
    toast.error(detailsPart);
  }
};

export const getUserStakePerPool = async (account, poolId) => {
  try {
    let data: any = await readContract({
      address: STAKING_CONTRACT,
      abi: StakingABI,
      functionName: "usersStakesPerPool",
      args: [account, poolId],
    });

    data = convertToEther(data);

    return data;
  } catch (e) {
    console.log("error is---->", e);
  }
};

export const claimRewardForPool = async (poolId) => {
  try {
    console.log("amount to stake is---->", poolId);
    emitter.emit("loading", true);
    const data = await writeContract({
      address: STAKING_CONTRACT,
      abi: StakingABI,
      functionName: "claimReward",
      args: [poolId],
    });
    const res: any = await waitForTransaction({
      hash: data?.hash,
    });
    console.log("after transactin finished", res);
    emitter.emit("loading", false);
    return res;
  } catch (e) {
    const detailsIndex = e?.message.indexOf("Details:");
    const detailsPart = e?.message.substring(detailsIndex);

    toast.error(detailsPart);
    emitter.emit("loading", false);
  }
};
export const getTotalWithdrawAllowedForPool = async (poolId, account) => {
  try {
    if (account) {
      const data = await readContract({
        address: STAKING_CONTRACT,
        abi: StakingABI,
        functionName: "totalUnstakeAllowed",
        args: [account, poolId],
      });

      return convertToEther(data);
    }
  } catch (e) {
    console.log("error is---->", e);
    toast.error(e.message);
    return 0;
  }
};

export const withdraw = async (poolId) => {
  try {
    console.log("pool id is--->", poolId);
    emitter.emit("loading", true);
    const data = await writeContract({
      address: STAKING_CONTRACT,
      abi: StakingABI,
      functionName: "unStake",
      args: [poolId],
    });
    const res: any = await waitForTransaction({
      hash: data?.hash,
    });
    if (res.status == "success") {
      toast.success("Transaction Successfull");

      emitter.emit("loading", true);
    } else {
      toast.error("Transaction Failed");
      emitter.emit("loading", true);
    }
    console.log("after transactin finished", res);
    emitter.emit("loading", false);
    window.location.reload();
    return res;
  } catch (e) {
    console.log("error is---->", e, typeof e.message);

    const detailsIndex = e?.message.indexOf("Details:");
    const detailsPart = e?.message.substring(detailsIndex);

    toast.error(detailsPart);

    emitter.emit("loading", false);

  }
};

export const withdrawPerStake = async (poolId, amount, stakeId) => {
  try {
    console.log("withdraw per stake details is", poolId, amount, stakeId);
    amount = convertToWei(amount);
    console.log("amount in withperstake is----->",amount);
    emitter.emit("loading", true);
    const data = await writeContract({
      address: STAKING_CONTRACT,
      abi: StakingABI,
      functionName: "unStakeIndividual",
      args: [poolId, stakeId],
    });
    const res: any = await waitForTransaction({
      hash: data?.hash,
    });
    if (res.status == "success") {
      toast.success("Transaction Successful");

      emitter.emit("loading", true);
      window.location.reload();
    } else {
      toast.error("Transaction Failed");
      emitter.emit("loading", true);
      window.location.reload();
    }
    console.log("after transactin finished", res);
    emitter.emit("loading", false);
    return res;
  } catch (e) {
    console.log("error is---->", e, typeof e.message);

    const detailsIndex = e?.message.indexOf("Details:");
    const detailsPart = e?.message.substring(detailsIndex);

    toast.error(detailsPart);

    emitter.emit("loading", false);
    // window.location.reload();
  }
};

export const totalStakeCountPerPool = async (account, poolId) => {
  try {
    // emitter.emit("loading", true);
    const data = await readContract({
      address: STAKING_CONTRACT,
      abi: StakingABI,
      functionName: "totalStakeCount",
      args: [account, poolId],
    });

    return data;
  } catch (e) {
    const detailsIndex = e?.message.indexOf("Details:");
    const detailsPart = e?.message.substring(detailsIndex);
    toast.error(detailsPart);
  }
};

export const getUserAllStakesForPool = async (account, poolId, stakeId) => {
  try {
    // emitter.emit("loading", true);
    const data = await readContract({
      address: STAKING_CONTRACT,
      abi: StakingABI,
      functionName: "userStakes",
      args: [account, poolId, stakeId],
    });

    return data;
  } catch (e) {
    const detailsIndex = e?.message.indexOf("Details:");
    const detailsPart = e?.message.substring(detailsIndex);
    toast.error(detailsPart);
  }
};

export const isPoolActive = async (poolId) => {
  try {
    // emitter.emit("loading", true);
    const data: any = await readContract({
      address: STAKING_CONTRACT,
      abi: StakingABI,
      functionName: "pools",
      args: [poolId],
    });
    console.log("pool is active ---->>>", data);

    return data[5];
  } catch (e) {
    const detailsIndex = e?.message.indexOf("Details:");
    const detailsPart = e?.message.substring(detailsIndex);
    return false;
  }
};

export async function estimateSlippage(tokenA, tokenB, amount) {
  // Fetch the reserves for each token in the liquidity pool
  try {
    amount = convertToWei(amount.toString());
    amount = Number(amount);
    const reserves = await getReserve(tokenA, tokenB);
    console.log("reserve is---->", reserves);
    const tokenAReserve = Number(reserves[0]);
    const tokenBReserve = Number(reserves[1]);
    const amountInTokenBEquivalent = (amount * tokenBReserve) / tokenAReserve;
    console.log("here is---->", amountInTokenBEquivalent);
    const newTokenAReserve = tokenAReserve + amount;
    const newTokenBReserve = tokenBReserve - amountInTokenBEquivalent;
    const newPrice = newTokenBReserve / newTokenAReserve;
    const oldPrice = tokenBReserve / tokenAReserve;
    const priceImpact = ((newPrice - oldPrice) / oldPrice) * 100;
    console.log("price impact", priceImpact);

    let estimatedSlippage;
    if (priceImpact < 0.5) {
      estimatedSlippage = 0.5; // Minimum slippage
    } else if (priceImpact < 1) {
      estimatedSlippage = 1; // Moderate slippage
    } else {
      estimatedSlippage = priceImpact; // High slippage for high price impact
    }

    return estimatedSlippage;
  } catch (e) {
    console.log("errror is---->", e);
  }
}
export async function addCommasToNumbers(number) {
  // Check if numbers is an array
   const parsedNumber = parseFloat(number);
   // Check if the parsed number is NaN (not a number)
   if (isNaN(parsedNumber)) {
     return "NaN";
   }
   // Format the number with commas for thousands separators
   return parsedNumber.toLocaleString();
}
