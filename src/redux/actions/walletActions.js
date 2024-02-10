// src/redux/actions/walletActions.js

export const connectWallet = (walletAddress) => {
  return {
    type: "CONNECT_WALLET",
    payload: walletAddress,
  };
};

export const disconnectWallet = () => {
  return {
    type: "DISCONNECT_WALLET",
  };
};
