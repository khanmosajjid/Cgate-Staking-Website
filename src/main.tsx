/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";
import { lightTheme, getDefaultWallets, RainbowKitProvider, Theme, } from "@rainbow-me/rainbowkit";
import { bscTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { BrowserRouter } from "react-router-dom";





// const { chains, publicClient, webSocketPublicClient } = configureChains(
//   [polygonMumbai],
//   [
//     alchemyProvider({ apiKey: "qTZu3Wk8ZJ9Grs4EZf5rPMe6i75WHDOt" }),
//     publicProvider(),
//   ]
// );
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bscTestnet],
  [alchemyProvider({ apiKey: "yourAlchemyApiKey" }), publicProvider()]
);



// );



const { connectors } = getDefaultWallets(
  
  
  {
  appName: "MV",
  projectId: "1ade470e0a2103b5f8113ed21f634435",
  chains,
});



const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const myCustomTheme: Theme = {
  blurs: {
    modalOverlay: '5px', // Example value, adjust the blur radius as needed
  },
  colors: {
    accentColor: '#109589',
    accentColorForeground: 'white',
    actionButtonBorder: '#109589',
    actionButtonBorderMobile: '#109589',
    actionButtonSecondaryBackground: 'white',
    closeButton: 'teal-600',
    closeButtonBackground: 'teal-600',
    connectButtonBackground: '#109589',
    connectButtonBackgroundError: 'red-600', // Use a color that indicates an error
    connectButtonInnerBackground: '#109589',
    connectButtonText: 'white',
    connectButtonTextError: 'red-600', // Use a color that indicates an error
    connectionIndicator: 'green-600', // Use a color that indicates a successful connection
    downloadBottomCardBackground: 'white',
    downloadTopCardBackground: 'white',
    error: 'red-600', // Use a color that indicates an error
    generalBorder: 'teal-600',
    generalBorderDim: 'gray-400', // Use a lighter color for less emphasis
    menuItemBackground: 'teal-600',
    modalBackdrop: 'rgba(0, 0, 0, 0.5)', // Semi-transparent backdrop
    modalBackground: 'white',
    modalBorder: 'gray-300',
    modalText: 'black',
    modalTextDim: 'gray-600', // Use a lighter/dimmer color for less emphasis
    modalTextSecondary: 'gray-500', // Use a color slightly lighter than modalTextDim
    profileAction: 'blue-600', // Use a color that indicates an actionable item
    profileActionHover: 'blue-700', // Use a darker shade for hover state
    profileForeground: 'white',
    selectedOptionBorder: 'blue-600', // Use a color that highlights selection
    standby: 'yellow-600', // Use a color that indicates a standby or warning state
  },
  fonts: {
    body: '"Roboto", sans-serif',
  },
  radii: {
    actionButton: '8px', // Example value, adjust the border-radius as needed
    connectButton: '24px',
    menuButton: '8px',
    modal: '12px',
    modalMobile: '10px',
  },
  shadows: {
    connectButton: '', // Example shadow, adjust as needed
    dialog: '0 4px 6px rgba(0, 0, 0, 0.1)',
    profileDetailsAction: '0 2px 4px rgba(0, 0, 0, 0.1)',
    selectedOption: '0 2px 4px rgba(0, 0, 0, 0.1)',
    selectedWallet: '0 2px 4px rgba(0, 0, 0, 0.1)',
    walletLogo: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};


// const config = createConfig({
//   autoConnect: true,
//   connectors: [
//     new MetaMaskConnector({ chains }),

//     new WalletConnectConnector({
//       chains,
//       options: {
//         projectId: "1ade470e0a2103b5f8113ed21f634435",
//       },
//     }),
//   ],
//   publicClient,
//   webSocketPublicClient,
// });



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={myCustomTheme}  appInfo={{
        appName: 'CGATE',
        learnMoreUrl: 'https://cgate-staking-website.vercel.app/',
      }} >
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </BrowserRouter>

    <ToastContainer />
  </React.StrictMode>
);


