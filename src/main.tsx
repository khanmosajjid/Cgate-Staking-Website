/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import { bscTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { BrowserRouter } from "react-router-dom";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bscTestnet],
  [alchemyProvider({ apiKey: "yourAlchemyApiKey" }), publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  
  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({ chains, options: { name: 'Injected' } }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "1ade470e0a2103b5f8113ed21f634435",
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
  
});



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiConfig config={config}>
        <App />
      </WagmiConfig>
    </BrowserRouter>

    <ToastContainer />
  </React.StrictMode>
);
