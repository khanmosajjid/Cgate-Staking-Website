/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import coin from "../../assets/Bitcoin.svg";
import X from "../../assets/X.svg";
import {
  checkAllowance,
  approveToken,
  cGateBalance,
  stake,
  getMinAmountIn,
} from "../../utils/web3Utils.js";
import { addDepositHistory } from "../../utils/apiServices.js";
import TOKEN_ABI from "../../constants/tokenABI.json";
import {
  STAKING_CONTRACT,
  TOKEN_CONTRACT,
  ADMIN,
} from "../../constants/contracts";
import { toast } from "react-toastify";

import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { ThreeCircles } from "react-loader-spinner";
interface DepositCardProps {
  setOpenDepositeCG8: (value: boolean) => void;
  setTransaction: (value: boolean) => void;
  title: string;
  subheading: string;
  withdraw?: string;
  data?: any;
  setTransactionId?: any;
}

const DepositeCG8: React.FC<DepositCardProps> = ({
  setOpenDepositeCG8,
  setTransaction,
  title,
  subheading,
  data,
  setTransactionId,
}) => {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState<number>(0);
  const [cg8Balance, setCg8Balance] = useState(0.0);
  const [poolTime, setPoolTime] = useState<any>();
  const [poolId, setPoolId] = useState();
  const [stakeAmount, setStakeAmount] = useState<any>(0);
  const [referrer, setReferrer] = useState<any>("");
  const [loader, setLoader] = useState(false);
  const { chain } = useNetwork();
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [cg8Price, setCg8Price] = useState<any>();

  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  useEffect(() => {
    try {
      console.log("data of props is--->", data);
      const days = Number(data[0]) / (24 * 60 * 60);
      setPoolId(data[10]);
      setPoolTime(days?.toFixed(0));
      const ref = localStorage.getItem("refAddress");
      if (ref) {
        setReferrer(ref);
      } else {
        setReferrer(ADMIN);
      }
      const getCG8Balance = async () => {
        if (isConnected) {
          let price: any = await getMinAmountIn("1");
          price = parseFloat(price).toFixed(2);
          setCg8Price(price);
          const res: any = await cGateBalance(address);
          setCg8Balance(parseFloat(res));
        }
        getCG8Balance();
      };
      getCG8Balance();
    } catch (e) {
      console.log("");
    }
  }, [isConnected, address]);

  const handleStakeAmountChange = async (e) => {
    setStakeAmount(e.target.value);

    if (e.target.value > cg8Balance) {
      // toast.error("Insufficient Cg8");
      setStakeAmount(0);
      setInsufficientBalance(true);
      return;
    } else {
      setInsufficientBalance(false);
    }
  };
  const handleReferrerChange = async (e) => {
    setReferrer(e.target.value);
  };

  const approve = async () => {
    try {
      setLoader(true);
      const res = await approveToken(
        address,
        STAKING_CONTRACT,
        TOKEN_CONTRACT,
        TOKEN_ABI
      );

      if (res.status == "success") {
        toast.success("Transaction Successfull");
        setLoader(false);
      } else {
        toast.error("Transaction Failed");
        setLoader(false);
      }
    } catch (e) {
      console.log("error is", e);
      setLoader(false);
    }
  };
  const stakeToken = async () => {
    try {
      console.log("Stake amount is--->", stakeAmount);
      if (chain?.id != chains[0]?.id) {
        toast.error("Wrong Network !!");
        return;
      }
      if (stakeAmount == 0) {
        toast.error("Staking amount can not be 0");
        return;
      }
      if (stakeAmount > cg8Balance) {
        toast.error("Insufficient Balance");
        return;
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(referrer)) {
        toast.error("Invalid referrer address");
        return false;
      }
      if(referrer==address){
        toast.error("You cannot refer yourself");
        return;
      }

      const allowance: any = await checkAllowance(
        address,
        STAKING_CONTRACT,
        TOKEN_CONTRACT,
        TOKEN_ABI
      );
      
      if (parseInt(allowance) < parseInt(stakeAmount)) {
        await approve();
      }
      setLoader(true);
      const res = await stake(poolId, stakeAmount, referrer);

      // transactionHash;
      console.log("res of deposit is--->", res);
      // return;
      if (res.status == "success") {
        setTransactionId(res?.transactionHash);
        // const deposit = await addDepositHistory(
        //   address,
        //   stakeAmount,
        //   poolId,
        //   res?.transactionHash,
        //   referrer
        // );

        toast.success("Transaction Successfull");
        setStakeAmount(0);

        setLoader(false);
        setTransaction(true);
        // window.location.reload();
      } else {
        toast.error("Transaction Failed");
        setLoader(false);
        setStakeAmount(0);
        // window.location.reload();
      }
    } catch (e) {
      console.log("error is---->", e);
      setLoader(false);
      setStakeAmount(0);
      // window.location.reload();
    }
  };

  return (
    <>
      {loader ? (
        <div className="spinner">
          <ThreeCircles
            height="100"
            width="100"
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor=""
            innerCircleColor=""
            middleCircleColor=""
          />
        </div>
      ) : (
        ""
      )}
      <div className="bg-[#F5F6FE] p-6 lg:w-[500px] w-[370px] ml-2.5 md:ml-0 rounded-2xl shadow-lg border">
        <div className="flex justify-between">
          <h2 className=" font-semibold mb-6">{title}</h2>
          <button>
            <img
              src={X}
              alt=""
              onClick={() => {
                setOpenDepositeCG8(false);
              }}
            />
          </button>
        </div>

        <div className="mb-6 bg-white border flex p-2 rounded-xl ">
          {/* <img src={coin} alt='' className='h-8 w-8 mt-1' /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
          >
            <rect width="40" height="40" rx="20" fill="#1E40AF" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M28.6294 16.4883L28.7305 16.789H31.8854L31.7813 16.2507C31.6018 15.3221 31.2735 14.4724 30.7952 13.7058C30.3194 12.9375 29.7245 12.2781 29.0126 11.7293C28.3063 11.1743 27.5039 10.7498 26.6093 10.4536C25.7157 10.1499 24.7574 10 23.7372 10C22.4951 10 21.3464 10.2239 20.2965 10.678C19.2489 11.1312 18.339 11.7847 17.5708 12.637C16.8009 13.4912 16.2092 14.5211 15.7921 15.7188L15.7916 15.7202C15.3789 16.9172 15.1764 18.2543 15.1764 19.7255C15.1764 21.6865 15.5316 23.4065 16.2591 24.8702L16.2599 24.8716C16.9913 26.3303 18.0149 27.4643 19.3285 28.2614C20.6491 29.0588 22.1722 29.451 23.8824 29.451C25.4152 29.451 26.7909 29.139 27.9972 28.5029C29.2084 27.8615 30.1642 26.9533 30.8546 25.7811C31.5559 24.6007 31.8987 23.2231 31.8987 21.6654V19.2761H25.4421V22.1148H28.8346C28.7674 22.9012 28.5627 23.5869 28.2288 24.1802C27.817 24.9165 27.2419 25.4878 26.4954 25.8963C25.7559 26.2985 24.8888 26.5065 23.8824 26.5065C22.8021 26.5065 21.8431 26.2477 20.9945 25.7377C20.1529 25.2319 19.4789 24.4842 18.9746 23.4767C18.4763 22.481 18.216 21.237 18.216 19.7255C18.216 18.2133 18.4735 16.9687 18.9665 15.9725C19.4657 14.9636 20.1288 14.2163 20.9523 13.7114C21.7838 13.2016 22.7088 12.9445 23.7372 12.9445C24.3725 12.9445 24.9471 13.0279 25.4641 13.19C25.9837 13.3529 26.4413 13.587 26.8408 13.8902L26.843 13.8919C27.2508 14.1971 27.6008 14.5665 27.8939 15.0019L27.8976 15.0072C28.1979 15.4395 28.4424 15.9322 28.6294 16.4883Z"
              fill="#F0B90B"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.2606 16.789H7.1435L7.24077 16.2556C7.41943 15.2758 7.74679 14.3949 8.22714 13.6188C8.7031 12.8439 9.29603 12.186 10.0044 11.6476C10.7105 11.1051 11.5013 10.6952 12.3737 10.4166C13.2409 10.1378 14.164 10 15.1407 10C16.7934 10 18.2794 10.3932 19.5864 11.1901C20.8932 11.9869 21.9188 13.1199 22.6619 14.5766C23.4091 16.0413 23.774 17.7628 23.774 19.7255C23.774 21.6882 23.4091 23.4097 22.6619 24.8744C21.9188 26.3311 20.8932 27.4641 19.5864 28.2609C18.2794 29.0579 16.7934 29.451 15.1407 29.451C14.1639 29.451 13.2407 29.3132 12.3734 29.0343C11.5016 28.756 10.7113 28.3493 10.0054 27.8129L10.0035 27.8115C9.29544 27.2673 8.70265 26.6066 8.22671 25.8316C7.74708 25.0505 7.41965 24.1702 7.24086 23.1959L7.14288 22.662H10.2599L10.335 23.0138C10.4564 23.582 10.6667 24.0776 10.9628 24.5066L10.9635 24.5077C11.2596 24.9392 11.621 25.304 12.05 25.6034C12.4757 25.8988 12.9506 26.1235 13.4776 26.276C14.0069 26.4292 14.5608 26.5065 15.1407 26.5065C16.1948 26.5065 17.1384 26.2486 17.9817 25.7386C18.811 25.2334 19.4796 24.486 19.9844 23.4776C20.477 22.4816 20.7344 21.2373 20.7344 19.7255C20.7344 18.2138 20.477 16.9695 19.9844 15.9735C19.4796 14.9651 18.811 14.2176 17.9816 13.7124C17.1384 13.2024 16.1947 12.9445 15.1407 12.9445C14.5608 12.9445 14.0069 13.0218 13.4776 13.175C12.9518 13.3272 12.4777 13.5542 12.0525 13.8547L12.0474 13.8583C11.6197 14.1513 11.2591 14.5125 10.9636 14.9434L10.9614 14.9465C10.6668 15.368 10.4567 15.8623 10.3352 16.4364L10.2606 16.789Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M28.6294 16.4883L28.7305 16.789H31.8854L31.7813 16.2507C31.6017 15.3219 31.2734 14.4721 30.795 13.7054C30.3192 12.9372 29.7244 12.278 29.0126 11.7293C28.3063 11.1743 27.5039 10.7498 26.6093 10.4536C25.7157 10.1499 24.7574 10 23.7372 10C22.4951 10 21.3464 10.2239 20.2965 10.678C19.2489 11.1312 18.339 11.7847 17.5708 12.637C16.8009 13.4912 16.2092 14.5211 15.7921 15.7188L15.7916 15.7202C15.3789 16.9172 15.1764 18.2543 15.1764 19.7255V20.1749H18.216V19.7255C18.216 18.2133 18.4736 16.9687 18.9665 15.9725C19.4657 14.9636 20.1288 14.2163 20.9523 13.7114C21.7838 13.2016 22.7089 12.9445 23.7372 12.9445C24.3725 12.9445 24.9471 13.0279 25.4641 13.19C25.9837 13.3529 26.4413 13.587 26.8408 13.8902L26.843 13.8919C27.2508 14.1971 27.6008 14.5665 27.8939 15.0019L27.8976 15.0072C28.1979 15.4395 28.4424 15.9322 28.6294 16.4883Z"
              fill="#F0B90B"
            />
          </svg>
          <input
            type="number"
            value={stakeAmount}
            onChange={handleStakeAmountChange}
            className="w-full p-2 mx-4  rounded bg-white"
            placeholder="10.00"
          />
          <button
            className="text-teal-600 md:mt-0 mt-2"
            onClick={() => {
              setStakeAmount(
             cg8Balance.toFixed(2)
              );
            }}
          >
            MAX
          </button>
        </div>
        {insufficientBalance ? (
          <h1 className="text-red-600 text-[16px] -mt-4 mb-3">
            Insufficient CG8 balance
          </h1>
        ) : (
          ""
        )}

        <div className="flex justify-between">
          <div>{subheading}</div>
          <div className="block">
            <span className="block"> {parseFloat((cg8Balance).toFixed(2)).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )} CG8</span>
            <div className="text-xs text-right">
              ~$
              {parseFloat((cg8Balance * cg8Price).toFixed(2)).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </div>
          </div>
        </div>

        <br />
        <hr />
        <br />
        {/* <div className="mb-3  text-sm flex justify-between">
          <label className="block  mb-2">{withdraw}</label>
          <div className="text-gray-600">10%</div>
        </div> */}
        <div className="mb-3  text-sm flex justify-between">
          <label className="block  mb-2">Pool APR</label>
          <div className="text-gray-600">{Number(data[3]) / 100}%</div>
        </div>
        <div className="mb-3  text-sm flex justify-between">
          <label className="block  mb-2">Pool type</label>
          <div className="text-gray-600">{poolTime == 0 ? "Unlocked" : `Locked for ${poolTime} days`}</div>
        </div>
        <div className="mb-3  text-sm flex justify-between">
          <label className="block  mb-2">Your reference</label>
        </div>
        <input
          className="text-gray-600  w-full p-2 rounded-3xl mb-3 border bg-white"
          value={referrer}
          placeholder="0xy543ca...8h432576"
          onChange={handleReferrerChange}
        />
        <hr />
        <br />
        <button
          className="w-full bg-teal-500 text-white p-2 md:rounded-2xl rounded-3xl  hover:bg-blue-600 transition"
          onClick={async () => {
            await stakeToken();
          }}
        >
          Confirm
        </button>
      </div>
    </>
  );
};

export default DepositeCG8;
