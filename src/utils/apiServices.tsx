/* eslint-disable @typescript-eslint/no-unused-vars */
// const API_BASE_URL = "http://localhost:8000/api";
const API_BASE_URL = "https://api.cgate.app/api";
const BSC_API_KEY = "MF2AM8D1Q77SX1TTFACVHMUKUC8BN4GB6Y";
import { TOKEN_CONTRACT } from "../constants/contracts";

import axios from "axios";

export const getTokenHoldersCount = async () => {
  try {
    const response = await axios.get(
      `https://api.bscscan.com/api?module=token&action=tokenholderlist&contractaddress=${TOKEN_CONTRACT}&page=1&offset=10&apikey=${BSC_API_KEY}`
    );

    // Extract the number of holders from the response
    const holders = response.data.result;
    console.log("token holders are------>", holders);
    return holders.length; // Assuming the API returns an array of holders
  } catch (error) {
    console.error("Error fetching token holders:", error);
    return null;
  }
};

export async function loginUser(
  walletAddress,
  balance,
  totalDeposit,
  totalWithdrawn
) {
  const data = {
    walletAddress,
    balance,
    totalDeposit,
    totalWithdrawn,
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, data);
    console.log("User created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating user:",
      error.response ? error.response.data : error.message
    );
  }
}

export const addDepositHistory = async (
  walletAddress,
  depositAmount,
  poolId,
  transactionHash,
  referrer,
  maturitydate
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/history/addDepositHistory`,
      {
        walletAddress,
        depositAmount,
        poolId,
        transactionHash,
        referrer,
        maturitydate,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding deposit history:", error);
    throw error;
  }
};
export const addSwapHistory = async (walletAddress, inAmount, outAmount) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/history/addSwapHistory`,
      {
        walletAddress,
        inAmount,
        outAmount,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding deposit history:", error);
    throw error;
  }
};

export const getDepositHistory = async (
  walletAddress,
  page = 1,
  limit = 10
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/history/getDepositHistory`,
      {
        params: { walletAddress, page, limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting deposit history:", error);
    throw error;
  }
};
export const addClaimHistory = async (
  walletAddress,
  claimAmount,
  poolId,
  transactionHash
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/history/addClaimHistory`,
      {
        walletAddress,
        claimAmount,
        poolId,
        transactionHash,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding deposit history:", error);
    throw error;
  }
};

export const getClaimHistory = async (walletAddress, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/history/getClaimHistory`,
      {
        params: { walletAddress, page, limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting deposit history:", error);
    throw error;
  }
};

export const getSwapHistory = async (walletAddress, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history/getSwapHistory`, {
      params: { walletAddress, page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting deposit history:", error);
    throw error;
  }
};

export const addWithdrawHistory = async (
  walletAddress,
  withdrawAmount,
  poolId,
  transactionHash
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/history/addWithdrawHistory`,
      {
        walletAddress,
        withdrawAmount,
        poolId,
        transactionHash,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding withdraw history:", error);
    throw error;
  }
};

export const getWithdrawHistory = async (
  walletAddress,
  page = 1,
  limit = 10
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/history/getWithdrawHistory`,
      {
        params: { walletAddress, page, limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting withdraw history:", error);
    throw error;
  }
};
export const getAllPoolRewards = async (
 
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/history/getPoolRewards`);
      console.log("get pool rewards", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting withdraw history:", error);
    throw error;
  }
};
