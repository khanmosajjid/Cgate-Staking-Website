/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import Header from "../Header/Header";
import coin from "./assets/coin.svg";
import CardSwap from "../CardSwap/CardSwap";
import ClaimHistory from "./ClaimHistory";
import DepositeHistory from "./DepositeHistory";
import DepositeCG8 from "./DepositeCG8";
import { ConnectWallet } from "../Header/ConnectWallet.js";
import SuccessCard from "../TransactionCard/TransactionCard";
import bg from "../../assets/Master-bg.svg";
import { toast } from "react-toastify";

import {
  getTotalPoolsCount,
  poolsDetails,
  userDetails,
  getUsdcToClaimed,
  checkAllowance,
  getUsdcBalance,
  approveToken,
  convertToEther,
  getUserStakePerPool,
  cGateBalance,
  claimRewardForPool,
  withdraw,
  getMinAmountOut,
  getMinAmountIn,
  addCommasToNumbers
} from "../../utils/web3Utils.js";
import { useAccount } from "wagmi";
import { STAKING_CONTRACT, TOKEN_CONTRACT } from "../../constants/contracts";
import { ThreeCircles } from "react-loader-spinner";
import TOKEN_ABI from "../../constants/tokenABI.json";
import USDC_ABI from "../../constants/usdcABI.json";
import { emitter } from "../../utils/eventEmitter.js";
import WithdrawAll from "./WithdrawAll.js";
import { addClaimHistory } from "../../utils/apiServices.js";
import WithdrawalHistory from "./WithdrawalHistory.js";

const Deposite: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openClaimHistory, setOpenClaimHistory] = useState(false);
  const [openDepositeHistory, setOpenDepositeHistory] = useState(false);
  const [openWithdrawHistory, setOpenWithdrawHistory] = useState(false);
  const [enablePools, setEnablePools] = useState(false);
  const [openDepositeCG8, setOpenDepositeCG8] = useState(false);
  const [openWithdrawCG8, setOpenWithdrawCG8] = useState(false);
  const [amountToClaimed, setAmountToClaimed] = useState<any>(0);
  const [loader, setLoader] = useState(false);
  const [Transaction, setTransaction] = useState(false);
  const [TransactionId, setTransactionId] = useState<any>();
  const [openClaimCard, setOpenClaimCard] = useState(false);
  const [pools, setPools] = useState([]);
  const { address, isConnected } = useAccount();
  const [lockedPool, setLockedPool] = useState(false);
  const [openRefsuggestion, setOpenRefsuggestion] = useState(false);
  const [openDepsuggestion, setOpenDepsuggestion] = useState(false);
  const [depositbtn, setdepositbtn] = useState(true);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [depositData, setDepositData] = useState({});
  const settingsRef = useRef(null);
  const [claimAmount, setClaimAmount] = useState<any>(0);
  const [poolId, setPoolId] = useState<any>(0);
  const [poolTime, setPoolTime] = useState<any>(0);
  const [transactionHash, setTransactionHash] = useState("");
  const [withdrawnTillNow, setWithdrawnTillNow] = useState();
  const [cg8Price, setCg8Price] = useState<any>();

  const closeSettings = () => {
    setOpenSettings(false);
    setOpenRefsuggestion(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        closeSettings();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const getPoolsCount = async () => {
      await getTotalPoolsCount();
      const pool = await poolsDetails(address);
      if (isConnected) {
        setLoader(true);
        let price: any = await getMinAmountIn("1");
        price = parseFloat(price).toFixed(2);
        setCg8Price(price);
        const user: any = await userDetails(address);

        let amnt: any = Number(user[2]);
        amnt = parseFloat(convertToEther(amnt).toString()).toFixed(2);
        setWithdrawnTillNow(amnt);

        const res: any = await convertToEther(Number(user[1]));

        setTotalDeposit(res);

        setLoader(false);
        const amount = await getUsdcToClaimed(address);
        setAmountToClaimed(amount);
        const bal: any = await cGateBalance(address);

        const allowance: any = await checkAllowance(
          address,
          STAKING_CONTRACT,
          TOKEN_CONTRACT,
          TOKEN_ABI
        );

        if (allowance == 0) {
          setdepositbtn(true);
        } else {
          setdepositbtn(false);
        }
      }

      setPools(pool);
    };
    getPoolsCount();
  }, [address, depositbtn]);

  useEffect(() => {
    const handleLoader = (isLoading) => {
      setLoader(isLoading);
    };

    emitter.on("loading", handleLoader);

    // Clean up the event listener
    return () => {
      emitter.off("loading", handleLoader);
    };
  }, []);

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
        setdepositbtn(true);
        toast.success("Transaction Successful");
        setLoader(false);
        setOpenCard(false);
        window.location.reload();
      } else {
        toast.error("Transaction Failed");
        setLoader(false);
        setOpenCard(false);
        window.location.reload();
      }
    } catch (e) {
      console.log("error is", e);
      setLoader(false);
      setOpenCard(false);
      window.location.reload();
    }
  };

  const handleToggle = () => {
    console.log("pools is---->", pools);

    setIsActive(!isActive);
    if (isActive) {
      //  for (let i = 0; i < pools.length; i++) {
      //    if (pools[i][7] == "0.0") {
      //      pools.splice(i, 1);
      //    }
      //  }
    }
    setdepositbtn(!4);
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
      <div className="fixed -z-10 overflow-hidden lg:h-screen">
        <img className="fixed w-full " src={bg} alt="" />
      </div>

      <div className="md:ml-[250px]">
        <div
          className={`${
            openCard ||
            openClaimHistory ||
            openDepositeHistory ||
            openDepositeCG8 ||
            Transaction ||
            openClaimCard ||
            openWithdrawCG8 ||
            openWithdrawHistory
              ? "pointer-events-none blur-lg"
              : ""
          } transition-all duration-300  w-[95%] mx-auto md:w-auto `}
        >
          <div className=" pt-20 lg:pt-0 mb-3 md:mb-0">
            <Header heading={"Deposit CG8 to earn USDC"} />
          </div>

          <div className={` space-y-6 lg:mt-20  md:w-auto    `}>
            <div className="md:px-12 md:pl-7 px-6  py-3 bg-white rounded-xl shadow-md  border">
              <div className="flex justify-between">
                <h1 className="text-[20px]">My deposit summary</h1>
                <button
                  className="text-teal-500 font-bold text-xl"
                  onClick={() => {
                    setOpenSettings(!openSettings);
                  }}
                >
                  •••
                </button>
              </div>

              {openSettings ? (
                <div
                  ref={settingsRef}
                  className="bg-white border p-4 rounded-xl absolute lg:left-[890px] text-teal-600 font-light py-2"
                >
                  <button
                    className="my-2 block"
                    onClick={() => {
                      setOpenClaimHistory(true);
                      setOpenSettings(false);
                    }}
                  >
                    My claim history
                  </button>
                  <button
                    className="mb-2"
                    onClick={() => {
                      setOpenDepositeHistory(true);
                      setOpenSettings(false);
                    }}
                  >
                    My deposit history
                  </button>
                  <button
                    className="mb-2 block"
                    onClick={() => {
                      setOpenWithdrawHistory(true);
                      setOpenSettings(false);
                    }}
                  >
                    My withdrawal history
                  </button>
                </div>
              ) : (
                ""
              )}

              <div className="md:flex gap-16 items-center mt-6 ">
                <div className="flex flex-col items-left md:space-y-2 py-4 md:py-0">
                  <div className="text-lg font-light">USDC to be claimed</div>
                  <div className="text-3xl  ">
                    {amountToClaimed?.toFixed(2)}
                  </div>
                  <div className="text-gray-600">
                    ~${amountToClaimed?.toFixed(2)}
                  </div>
                </div>

                <div className="flex flex-col items-left md:space-y-2 py-4 md:py-0">
                  <div className="text-lg font-light">Total deposited CG8</div>
                  {address ? (
                    <div className="text-3xl ">
                      {parseFloat(totalDeposit.toString()).toFixed(2)}
                    </div>
                  ) : (
                    <div className="text-3xl ">0.00</div>
                  )}

                  {totalDeposit ? (
                    <div className="text-gray-600">
                      ~$
                      {parseFloat(
                        (Number(totalDeposit) * cg8Price).toFixed(2)
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  ) : (
                    <div className="text-gray-600">~$0.00</div>
                  )}
                </div>

                <div className="flex flex-col items-left md:space-y-2 py-4 md:py-0">
                  <div className="text-lg font-light">Earnings YTD</div>
                  {isConnected ? "" : <div className="text-3xl ">0.00</div>}
                  {withdrawnTillNow ? (
                    <div className="text-3xl ">{withdrawnTillNow}</div>
                  ) : (
                    <div className="text-gray-600">~$0.00</div>
                  )}
                  {withdrawnTillNow ? (
                    <div className="text-gray-600">~${withdrawnTillNow}</div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4  border shadow-lg rounded-2xl bg-white">
              <div className="flex justify-between py-3 px-7 ">
                <div className="text-[20px] ">Pools</div>
                <div>
                  <div
                    onClick={handleToggle}
                    className={`relative  inline-block w-12 align-middle select-none transition duration-200 ease-in `}
                  >
                    <input type="checkbox" className="hidden" />
                    <span
                      className={`block transition duration-200 ease-in cursor-pointer rounded-full ${
                        isActive ? "bg-teal-600" : "bg-gray-200"
                      } relative w-11 h-5`}
                    ></span>
                    <span
                      className={`absolute top-0 left-0 ml-[2px] mt-[2px] transition duration-200 ease-in inline-block w-4 h-4 transform bg-white rounded-full shadow-lg ${
                        isActive ? "translate-x-6" : ""
                      }`}
                    ></span>
                  </div>
                  <span className="font-light">Used only</span>
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 gap-6 grid grid-cols-1 md:px-6 px-4 pb-4 ">
                {pools?.map((value: any, idx: any) => (
                  <>
                    {console.log("pool value is---->", value)}
                    {console.log("pool index is------>", idx)}
                    {value[5] ? (
                      <div
                        key={idx}
                        className=" px-3 py-2 rounded-xl shadow-md flex flex-col space-y-2 bg-[#F5F6FE]"
                      >
                        <div className=" justify-between items-center">
                          <div className="flex ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              fill="none"
                            >
                              <rect
                                width="40"
                                height="40"
                                rx="20"
                                fill="#1E40AF"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M28.6292 16.4883L28.7303 16.789H31.8853L31.7812 16.2507C31.6016 15.3221 31.2733 14.4724 30.795 13.7058C30.3193 12.9375 29.7244 12.2781 29.0125 11.7293C28.3062 11.1743 27.5038 10.7498 26.6092 10.4536C25.7156 10.1499 24.7572 10 23.737 10C22.4949 10 21.3462 10.2239 20.2964 10.678C19.2488 11.1312 18.3389 11.7847 17.5706 12.637C16.8007 13.4912 16.2091 14.5211 15.7919 15.7188L15.7915 15.7202C15.3788 16.9172 15.1763 18.2543 15.1763 19.7255C15.1763 21.6865 15.5314 23.4065 16.259 24.8702L16.2597 24.8716C16.9912 26.3303 18.0147 27.4643 19.3284 28.2614C20.649 29.0588 22.172 29.451 23.8822 29.451C25.415 29.451 26.7907 29.139 27.9971 28.5029C29.2083 27.8615 30.1641 26.9533 30.8545 25.7811C31.5557 24.6007 31.8986 23.2231 31.8986 21.6654V19.2761H25.4419V22.1148H28.8344C28.7672 22.9012 28.5625 23.5869 28.2287 24.1802C27.8169 24.9165 27.2418 25.4878 26.4953 25.8963C25.7557 26.2985 24.8887 26.5065 23.8822 26.5065C22.802 26.5065 21.8429 26.2477 20.9943 25.7377C20.1527 25.2319 19.4787 24.4842 18.9745 23.4767C18.4762 22.481 18.2159 21.237 18.2159 19.7255C18.2159 18.2133 18.4734 16.9687 18.9663 15.9725C19.4656 14.9636 20.1286 14.2163 20.9522 13.7114C21.7837 13.2016 22.7087 12.9445 23.737 12.9445C24.3723 12.9445 24.9469 13.0279 25.4639 13.19C25.9835 13.3529 26.4411 13.587 26.8406 13.8902L26.8429 13.8919C27.2507 14.1971 27.6006 14.5665 27.8938 15.0019L27.8975 15.0072C28.1977 15.4395 28.4422 15.9322 28.6292 16.4883Z"
                                fill="#F0B90B"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.2606 16.789H7.14344L7.24071 16.2556C7.41937 15.2758 7.74673 14.3949 8.22708 13.6188C8.70304 12.8439 9.29597 12.186 10.0043 11.6476C10.7104 11.1051 11.5012 10.6952 12.3736 10.4166C13.2408 10.1378 14.1639 10 15.1406 10C16.7934 10 18.2794 10.3932 19.5864 11.1901C20.8931 11.9869 21.9187 13.1199 22.6619 14.5766C23.4091 16.0413 23.774 17.7628 23.774 19.7255C23.774 21.6882 23.4091 23.4097 22.6619 24.8744C21.9187 26.3311 20.8931 27.4641 19.5864 28.2609C18.2794 29.0579 16.7934 29.451 15.1406 29.451C14.1638 29.451 13.2406 29.3132 12.3734 29.0343C11.5016 28.756 10.7112 28.3493 10.0053 27.8129L10.0034 27.8115C9.29538 27.2673 8.70259 26.6066 8.22665 25.8316C7.74702 25.0505 7.41959 24.1702 7.2408 23.1959L7.14282 22.662H10.2599L10.335 23.0138C10.4563 23.582 10.6666 24.0776 10.9628 24.5066L10.9635 24.5077C11.2595 24.9392 11.6209 25.304 12.0499 25.6034C12.4756 25.8988 12.9506 26.1235 13.4775 26.276C14.0069 26.4292 14.5608 26.5065 15.1406 26.5065C16.1947 26.5065 17.1384 26.2486 17.9816 25.7386C18.8109 25.2334 19.4795 24.486 19.9843 23.4776C20.477 22.4816 20.7344 21.2373 20.7344 19.7255C20.7344 18.2138 20.477 16.9695 19.9844 15.9735C19.4795 14.9651 18.8109 14.2176 17.9815 13.7124C17.1383 13.2024 16.1947 12.9445 15.1406 12.9445C14.5608 12.9445 14.0069 13.0218 13.4775 13.175C12.9517 13.3272 12.4777 13.5542 12.0525 13.8547L12.0473 13.8583C11.6196 14.1513 11.2591 14.5125 10.9635 14.9434L10.9613 14.9465C10.6668 15.368 10.4566 15.8623 10.3352 16.4364L10.2606 16.789Z"
                                fill="white"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M28.6292 16.4883L28.7303 16.789H31.8853L31.7812 16.2507C31.6016 15.3219 31.2732 14.4721 30.7948 13.7054C30.3191 12.9372 29.7242 12.278 29.0124 11.7293C28.3061 11.1743 27.5038 10.7498 26.6092 10.4536C25.7156 10.1499 24.7572 10 23.737 10C22.4949 10 21.3462 10.2239 20.2964 10.678C19.2488 11.1312 18.3389 11.7847 17.5706 12.637C16.8007 13.4912 16.2091 14.5211 15.7919 15.7188L15.7915 15.7202C15.3788 16.9172 15.1763 18.2543 15.1763 19.7255V20.1749H18.2159V19.7255C18.2159 18.2133 18.4734 16.9687 18.9663 15.9725C19.4656 14.9636 20.1286 14.2163 20.9522 13.7114C21.7837 13.2016 22.7087 12.9445 23.737 12.9445C24.3723 12.9445 24.9469 13.0279 25.4639 13.19C25.9835 13.3529 26.4412 13.587 26.8406 13.8902L26.8429 13.8919C27.2507 14.1971 27.6006 14.5665 27.8938 15.0019L27.8975 15.0072C28.1977 15.4395 28.4422 15.9322 28.6292 16.4883Z"
                                fill="#F0B90B"
                              />
                            </svg>
                            <img
                              src={coin}
                              alt="Icon"
                              className="w-10 h-10 -ml-3 mr-5"
                            />
                            <div className="block">
                              <span className="text-xl block">CG8</span>
                              {Number(value[0]) / (24 * 60 * 60) > 0 ? (
                                <span className="text-gray-600 text-sm">
                                  locked for {""}
                                  {Number(value[0]) / (24 * 60 * 60)} Day
                                </span>
                              ) : (
                                <span className="text-gray-600 text-sm">
                                  Unlocked
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-600 flex justify-between font-bold">
                          <span className="font-bold">APR</span>
                          <div className="flex gap-3  align-text-bottom">
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="16"
                                viewBox="0 0 14 16"
                                fill="none"
                              >
                                <path
                                  d="M1.08325 0.5H13.0833C13.4975 0.5 13.8333 0.83579 13.8333 1.25V14.75C13.8333 15.1642 13.4975 15.5 13.0833 15.5H1.08325C0.669042 15.5 0.333252 15.1642 0.333252 14.75V1.25C0.333252 0.83579 0.669042 0.5 1.08325 0.5ZM1.83325 2V14H12.3333V2H1.83325ZM3.33325 3.5H10.8333V6.5H3.33325V3.5ZM3.33325 8H4.83325V9.5H3.33325V8ZM3.33325 11H4.83325V12.5H3.33325V11ZM6.33325 8H7.83325V9.5H6.33325V8ZM6.33325 11H7.83325V12.5H6.33325V11ZM9.33325 8H10.8333V12.5H9.33325V8Z"
                                  fill="#0D9488"
                                />
                              </svg>
                            </span>
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="14"
                                viewBox="0 0 16 14"
                                fill="none"
                              >
                                <path
                                  d="M0.833252 12.9249C0.833252 13.5723 1.23524 14 1.83278 14H15.3155C15.6849 14 15.9999 13.6763 15.9999 13.2717C15.9999 12.8787 15.6849 12.5434 15.3155 12.5434H2.26735C2.21303 12.5434 2.21303 12.5318 2.21303 12.4855V0.728321C2.21303 0.335257 1.89796 0 1.51771 0C1.14832 0 0.833252 0.335257 0.833252 0.728321V12.9249ZM1.95229 9.45662L4.95086 6.27748C5.05951 6.16182 5.13555 6.16182 5.23334 6.27748L7.81903 9.05199C8.145 9.38725 8.47096 9.5492 8.84032 9.5492C9.22058 9.5492 9.56824 9.38725 9.86161 9.05199L12.6646 6.02308L13.7402 7.17919C14.0552 7.50285 14.5116 7.32954 14.6311 6.84394L15.5872 2.60116C15.7067 2.16185 15.3372 1.79191 14.9135 1.90751L10.9372 2.90174C10.4917 3.01734 10.3071 3.53758 10.6221 3.84972L11.6868 4.98262L8.98161 7.90748C8.89461 8.02314 8.81863 8.02314 8.70993 7.91908L6.11332 5.10988C5.80916 4.77462 5.4724 4.61268 5.0921 4.61268C4.70098 4.61268 4.37505 4.77462 4.07084 5.10988L0.996213 8.41617L1.95229 9.45662Z"
                                  fill="#0D9488"
                                />
                              </svg>
                            </span>
                            <span className="text-black -mt-1">
                              {Number(value[3]) / 100}%
                            </span>
                          </div>
                        </div>
                        <div className="text-gray-600 flex justify-between ">
                          <div className="flex ">
                            <span>Pool size </span>
                            <span className="mt-[2px] ml-1">
                              <button
                                onClick={() => {
                                  setOpenRefsuggestion(!openRefsuggestion);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                >
                                  <path
                                    d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14Z"
                                    fill="#0D9488"
                                  />
                                  <path
                                    d="M6.36243 8.51912V8.47897C6.36684 8.0529 6.41093 7.71383 6.49471 7.46176C6.57848 7.20969 6.69753 7.00558 6.85185 6.84943C7.00617 6.69328 7.19136 6.54939 7.40741 6.41778C7.53748 6.33748 7.65432 6.24267 7.75794 6.13337C7.86155 6.02183 7.94312 5.89356 8.00265 5.74857C8.06437 5.60357 8.09524 5.44296 8.09524 5.26673C8.09524 5.04812 8.04453 4.85851 7.94312 4.6979C7.84171 4.53728 7.70613 4.41348 7.53638 4.32648C7.36662 4.23948 7.17813 4.19598 6.9709 4.19598C6.79012 4.19598 6.61596 4.23391 6.44841 4.30975C6.28086 4.3856 6.14087 4.50494 6.02844 4.66778C5.91601 4.83062 5.85097 5.04366 5.83333 5.30688H5C5.01764 4.92766 5.11464 4.60309 5.29101 4.33317C5.46958 4.06326 5.70437 3.85692 5.99537 3.71415C6.28858 3.57138 6.61376 3.5 6.9709 3.5C7.35891 3.5 7.69621 3.57808 7.9828 3.73423C8.27161 3.89038 8.49427 4.10453 8.65079 4.37667C8.80952 4.64882 8.88889 4.95889 8.88889 5.30688C8.88889 5.55226 8.85141 5.77422 8.77645 5.97275C8.7037 6.17129 8.59788 6.34863 8.45899 6.50478C8.32231 6.66093 8.15697 6.79924 7.96296 6.91969C7.76896 7.04238 7.61354 7.17177 7.49669 7.30784C7.37985 7.44168 7.29497 7.60118 7.24206 7.78633C7.18915 7.97148 7.16049 8.20236 7.15608 8.47897V8.51912H6.36243ZM6.78571 10.5C6.62258 10.5 6.48258 10.4409 6.36574 10.3227C6.2489 10.2044 6.19048 10.0628 6.19048 9.89771C6.19048 9.73263 6.2489 9.59098 6.36574 9.47275C6.48258 9.35453 6.62258 9.29541 6.78571 9.29541C6.94885 9.29541 7.08885 9.35453 7.20569 9.47275C7.32253 9.59098 7.38095 9.73263 7.38095 9.89771C7.38095 10.007 7.3534 10.1074 7.29828 10.1989C7.24537 10.2903 7.17372 10.3639 7.08333 10.4197C6.99515 10.4732 6.89594 10.5 6.78571 10.5Z"
                                    fill="white"
                                    stroke="white"
                                    strokeWidth="0.3"
                                  />
                                </svg>
                              </button>
                            </span>
                          </div>
                          {/* --------------------------------------------------------------------------------------------------- */}
                          {openRefsuggestion ? (
                            <div
                              className="bg-white z-10 left-[400px] absolute p-2 rounded-e-xl rounded-bl-xl w-60 mt-1"
                              ref={settingsRef}
                            >
                              <h1 className="text-xs">
                                Total amount of CG8 tokens deposited by all the
                                users in the single pool.
                              </h1>
                            </div>
                          ) : (
                            ""
                          )}
                          {/* --------------------------------------------------------------------------------------------------- */}

                          <div className="block items-end text-right">
                            {value[6] ? (
                              <span className="text-black block text-right">
                                {parseFloat(
                                  convertToEther(value[6]).toString()
                                ).toFixed(2)}{" "}
                                CG8
                              </span>
                            ) : (
                              <span className="text-black block text-right">
                                0.00 CG8
                              </span>
                            )}

                            {Number(convertToEther(value[6])) &&
                            cg8Price > 0 ? (
                              <div className="text-xs  text-right">
                                ~$
                                <span className="md:hidden">(</span>
                                {parseFloat(
                                  (
                                    Number(convertToEther(value[6])) * cg8Price
                                  ).toFixed(2)
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                                <span className="md:hidden"> )</span>{" "}
                                {/* USDC */}
                              </div>
                            ) : (
                              <div className="text-xs  text-right">
                                ~$
                                <span className="md:hidden">(</span>
                                0.00
                                <span className="md:hidden"> )</span>{" "}
                                {/* USDC */}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-gray-600 flex justify-between">
                          <div className="flex">
                            <span>Deposited </span>
                            <span className="mt-[2px] ml-1">
                              <button
                                onClick={() => {
                                  setOpenDepositeHistory(!openDepositeHistory);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                >
                                  <path
                                    d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14Z"
                                    fill="#0D9488"
                                  />
                                  <path
                                    d="M7 9.8V7"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M7 4.20001H7.007"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </span>
                          </div>
                          <div className="block text-right">
                            {address ? (
                              <span className="text-black block text-right">
                                {parseFloat(value[7]).toFixed(2)} CG8
                              </span>
                            ) : (
                              <span className="text-black block text-right">
                                0.00 CG8
                              </span>
                            )}

                            {value[7] ? (
                              <div className="text-xs text-right">
                                ~$
                                <span className="md:hidden">(</span>
                                {parseFloat(
                                  (Number(value[7]) * cg8Price).toFixed(2)
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                                <span className="md:hidden">)</span>{" "}
                                {/* USDC */}
                              </div>
                            ) : (
                              <div className="text-xs  text-right">
                                ~$
                                <span className="md:hidden">(</span>
                                0.00
                                <span className="md:hidden"> )</span>{" "}
                                {/* USDC */}
                              </div>
                            )}
                          </div>{" "}
                        </div>
                        <div className="text-gray-600 flex justify-between">
                          <span>To claim </span>
                          <div className="block text-right">
                            <span className="text-black block text-right">
                              {value[8]?.toFixed(2)} USDC
                            </span>
                            <div className="text-xs">
                              ~$
                              {parseFloat(
                                Number(value[8]).toFixed(2)
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          </div>{" "}
                        </div>
                        <div className="text-gray-600 flex justify-between">
                          <span>Allowed to withdraw </span>
                          <div className="block">
                            {address ? (
                              <>
                                {value[9] ? (
                                  <span className="text-black block text-right">
                                    {parseFloat(value[9]).toFixed(2)} CG8
                                  </span>
                                ) : (
                                  "0.00 CG8"
                                )}
                                {value[9] ? (
                                  <div className="text-xs text-right">
                                    ~$<span className="md:hidden">(</span>
                                    {parseFloat(
                                      (Number(value[9]) * cg8Price).toFixed(2)
                                    ).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                    <span className="md:hidden">)</span>{" "}
                                    {/* USDC */}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </>
                            ) : (
                              <>
                                <span className="text-black block text-right">
                                  0.00 CG8
                                </span>
                                <div className="text-xs text-right">
                                  ~$<span className="md:hidden">(</span>
                                  0.00
                                  <span className="md:hidden">)</span>{" "}
                                  {/* USDC */}
                                </div>
                              </>
                            )}
                          </div>{" "}
                        </div>

                        {isConnected ? (
                          <>
                            <div className="flex space-x-4 text-sm font-light py-2 ">
                              {depositbtn ? (
                                <button
                                  className="bg-teal-600 text-white p-2 rounded-2xl text-[12px] flex-grow "
                                  onClick={() => {
                                    setOpenCard(true);
                                    setPoolTime(
                                      (
                                        Number(value[0]) /
                                        (24 * 60 * 60)
                                      )?.toFixed(3)
                                    );
                                    console.log(
                                      "pool time agian isis---->",
                                      (
                                        Number(value[0]) /
                                        (24 * 60 * 60)
                                      )?.toFixed(3)
                                    );
                                    setEnablePools(true);
                                  }}
                                >
                                  Enable pool
                                </button>
                              ) : (
                                <button
                                  className=" p-2 rounded-3xl flex-grow w-20 text-white border text-[12px] bg-teal-600"
                                  onClick={() => {
                                    setOpenDepositeCG8(true);
                                    console.log(
                                      "data of pool iin deposit btn is----->",
                                      idx,
                                      value
                                    );
                                    value.push(idx);
                                    setDepositData(value);
                                  }}
                                >
                                  Deposit
                                </button>
                              )}
                              {value[9] > 0 ? (
                                <button
                                  className="p-2 rounded-3xl  flex-grow w-20 text-white border text-[12px] bg-teal-600 "
                                  onClick={async () => {
                                    //   await withdraw(idx);
                                    setOpenWithdrawCG8(true);
                                    setPoolId(idx);
                                  }}
                                >
                                  Withdraw
                                </button>
                              ) : (
                                <>
                                  {" "}
                                  <button
                                    disabled
                                    className={`${
                                      enablePools
                                        ? "text-teal-600 border border-teal-600"
                                        : "border-gray-300 border text-gray-500"
                                    } p-2 rounded-3xl flex-grow w-20 text-[12px] `}
                                    onClick={async () => {
                                      //   await withdraw(idx);
                                      //   setOpenWithdrawCG8(true);
                                      //   setPoolId(idx);
                                    }}
                                  >
                                    Withdraw
                                  </button>
                                </>
                              )}

                              {value[8] ? (
                                <button
                                  className="  p-2 rounded-3xl flex-grow w-20 text-white border text-[12px] bg-teal-600 "
                                  onClick={async () => {
                                    if (value[8] == "0" || value[8] == 0) {
                                      toast.error("Claim Amount is 0");
                                      return;
                                    }
                                    console.log("pool is id---->>", idx);
                                    setPoolId(idx);
                                    setClaimAmount(value[8]);

                                    setOpenClaimCard(true);
                                  }}
                                >
                                  Claim
                                </button>
                              ) : (
                                <>
                                  <button
                                    disabled
                                    className={`${
                                      enablePools
                                        ? "text-teal-600 border border-teal-600"
                                        : "border-gray-300 border text-gray-500"
                                    } p-2 rounded-3xl flex-grow w-20 text-[12px] `}
                                  >
                                    Claim
                                  </button>
                                </>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="">
                              <ConnectWallet></ConnectWallet>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>

        {openCard ? (
          <div className="absolute lg:left-[500px] top-[600px] md:top-20">
            <CardSwap
              setState={setOpenCard}
              svg={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="88"
                  height="105"
                  viewBox="0 0 101 100"
                  fill="none"
                >
                  <circle cx="50.5" cy="50" r="50" fill="#DBEAFE" />
                  <path
                    d="M39.8035 31.7862V58.7536C39.8035 62.6061 41.7386 64.5397 45.5493 64.5397H63.7692C67.5799 64.5397 69.5 62.5912 69.5 58.7536V42.7338C69.5 40.696 69.0833 39.387 67.7883 38.0632L57.5619 27.7106C56.3115 26.4462 54.9272 26 53.1409 26H45.5493C41.7535 26 39.8035 27.9486 39.8035 31.7862ZM42.4383 58.709V31.8457C42.4383 29.8079 43.5398 28.6328 45.6833 28.6328H54.3019V38.8664C54.3019 40.9935 55.3291 41.9603 57.3982 41.9603H66.8653V58.709C66.8653 60.7765 65.7639 61.907 63.6352 61.907H45.6684C43.5398 61.907 42.4383 60.7765 42.4383 58.709ZM56.6986 38.5094V30.031L66.121 39.5655H57.7555C57.0112 39.5655 56.6986 39.268 56.6986 38.5094Z"
                    fill="black"
                  />
                  <path
                    d="M30.5 68.1543C30.5 72.0068 32.4202 73.9405 36.2309 73.9405H54.4657C58.2764 73.9405 60.1965 71.9919 60.1965 68.1543V52.8039C60.1965 50.5876 59.9286 49.6207 58.5442 48.2224L47.5141 37.0518C46.2041 35.713 45.1324 35.4007 43.1527 35.4007H36.2309C32.45 35.4007 30.5 37.3641 30.5 41.1869V68.1543Z"
                    fill="white"
                  />
                  <path
                    d="M30.5 68.1543C30.5 72.0068 32.4202 73.9405 36.2309 73.9405H54.4657C58.2764 73.9405 60.1965 71.9919 60.1965 68.1543V52.8039C60.1965 50.5876 59.9286 49.6207 58.5442 48.2224L47.5141 37.0518C46.2041 35.713 45.1324 35.4007 43.1527 35.4007H36.2309C32.45 35.4007 30.5 37.3641 30.5 41.1869V68.1543ZM33.1347 68.1097V41.2464C33.1347 39.2086 34.2363 38.0335 36.3798 38.0335H43.1229V49.4422C43.1229 51.718 44.2691 52.8039 46.487 52.8039H57.5618V68.1097C57.5618 70.1772 56.4602 71.3077 54.3168 71.3077H36.3649C34.2363 71.3077 33.1347 70.1772 33.1347 68.1097ZM46.7847 50.3198C45.9363 50.3198 45.6088 49.9926 45.6088 49.1447V38.7474L57.0408 50.3198H46.7847Z"
                    fill="black"
                  />
                </svg>
              }
              heading="Enable Pool"
              subHeading={`CG8 locked for ${parseInt(poolTime)} day`}
              time={poolTime}
              p="Why is this required?"
              btntext="Proceed to your Wallet"
              onClick={() => {
                approve();
              }}
            />
          </div>
        ) : (
          ""
        )}

        {openClaimHistory ? (
          <div className=" lg:left-[360px] top-32 absolute">
            <ClaimHistory setOpenClaimHistory={setOpenClaimHistory} />
          </div>
        ) : (
          ""
        )}

        {openDepositeHistory ? (
          <div className="absolute lg:left-[360px] top-32">
            <DepositeHistory setOpenDepositeHistory={setOpenDepositeHistory} />
          </div>
        ) : (
          ""
        )}
        {openWithdrawHistory ? (
          <div className="absolute lg:left-[360px] top-32">
            <WithdrawalHistory
              setOpenWithdrawHistory={setOpenWithdrawHistory}
            />
          </div>
        ) : (
          ""
        )}

        {openDepositeCG8 ? (
          <div className=" lg:left-[360px] top-32 absolute">
            <DepositeCG8
              setOpenDepositeCG8={setOpenDepositeCG8}
              setTransaction={setTransaction}
              title="Deposit CG8 "
              subheading="Wallet balance"
              data={depositData}
              setTransactionId={setTransactionId}
              // transactionID={transactionHash}
              // withdraw='Allow to withdraw'
            />
          </div>
        ) : (
          ""
        )}

        {openWithdrawCG8 ? (
          <div className=" lg:left-[360px] top-32 absolute">
            <WithdrawAll
              setOpenWithdrawCG8={setOpenWithdrawCG8}
              poolId={poolId}
              poolTime={poolTime}
            />
          </div>
        ) : (
          ""
        )}

        {Transaction ? (
          <div className="absolute top-[100px] p-3">
            <SuccessCard
              transactionID={transactionHash ? transactionHash : TransactionId}
              setTransaction={setTransaction}
              msg="Transaction Successful!"
              svg={
                <svg
                  className="mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <circle cx="50" cy="50" r="50" fill="#DCFCE7" />
                  <path
                    d="M50 74C36.7452 74 26 63.2547 26 50C26 36.7452 36.7452 26 50 26C63.2547 26 74 36.7452 74 50C74 63.2547 63.2547 74 50 74ZM47.6062 59.6L64.5769 42.6294L61.1828 39.2353L47.6062 52.8118L40.8181 46.0234L37.424 49.4178L47.6062 59.6Z"
                    fill="#16A34A"
                  />
                </svg>
              }
              btntext="view in explorer"
            />
          </div>
        ) : (
          ""
        )}

        {lockedPool ? (
          <div className="absolute top-[100px] p-3">
            <SuccessCard
              setTransaction={setLockedPool}
              msg="Locked pool notice!"
              para="Please understand and agree that your principal will be locked in the smart contract and you will not be able to withdraw it during the agreed fixed term of 90 days."
              svg={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="101"
                  height="100"
                  viewBox="0 0 101 100"
                  fill="none"
                >
                  <circle cx="50.5" cy="50" r="50" fill="#DBEAFE" />
                  <path
                    d="M50.5 74C37.2452 74 26.5 63.2547 26.5 50C26.5 36.7452 37.2452 26 50.5 26C63.7547 26 74.5 36.7452 74.5 50C74.5 63.2547 63.7547 74 50.5 74ZM48.1 57.2V62H52.9V57.2H48.1ZM48.1 38V52.4H52.9V38H48.1Z"
                    fill="#2563EB"
                  />
                </svg>
              }
              btntext="Agree and proceed"
            />
          </div>
        ) : (
          ""
        )}

        {openClaimCard ? (
          <div className="absolute lg:left-[500px] top-32 ">
            <CardSwap
              setState={setOpenClaimCard}
              heading="Confirm your claim "
              heading2={claimAmount?.toFixed(2) + " USDC"}
              svg2={coin}
              subHeading={""}
              btntext="Confirm"
              onClick={async () => {
                console.log(
                  "claim amount is--->",
                  claimAmount,
                  typeof claimAmount,
                  poolId
                );
                if (claimAmount == 0 || claimAmount == "0") {
                  toast.error("Claim Amount is 0");
                  return;
                }
                const res: any = await claimRewardForPool(poolId);
                setTransactionHash(res.transactionHash);
                if (res.status == "success") {
                  // const claim = await addClaimHistory(
                  //   address,
                  //   claimAmount,
                  //   poolId,
                  //   res?.transactionHash
                  // );

                  toast.success("Transaction Successfull");

                  setLoader(false);
                  setTransaction(true);
                  window.location.reload();
                } else {
                  toast.error("Transaction Failed");
                  setLoader(false);
                  setTransaction(false);
                  window.location.reload();
                }
                setTransaction(true);
                setOpenClaimCard(false);
                window.location.reload();
              }}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Deposite;
