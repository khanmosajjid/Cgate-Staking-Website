/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, useState } from "react";
import { useRef, useEffect } from "react";
// import React from "react";
// import bg from "../../assets/Master-bg.svg";
import Header from "../Header/Header";
import HistoricalPrice from "./HistoricalPrice";
import { useNavigate } from "react-router-dom";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import {
  cGateBalance,
  getUsdcToClaimed,
  userDetails,
  convertToEther,
  getAmountOut,
  getMinAmountIn,
} from "../../utils/web3Utils";
import { loginUser } from "../../utils/apiServices";
import { USDC_CONTRACT, TOKEN_CONTRACT } from "../../constants/contracts";
import CG8stats from "./CG8stats";

const Frame: FunctionComponent = () => {
  const navigate = useNavigate();
  const [setting, setSetting] = useState(false);
  const [openHistoryPrice, setopenHistoryPrice] = useState(false);
  const [openCG8Details, setOpenCG8Details] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const { isConnected, address } = useAccount();
  const [cG8Balance, setCg8Balance] = useState(0);
  const [amountToClaim, setAmountToClaim] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState<any>();
  const [cg8Price, setCg8Price] = useState<any>();

  const settingsRef = useRef(null);

  const closeSettings = () => {
    setSetting(false);
  };
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        if (address && address != undefined) {
          let price: any = await getMinAmountIn(
            "1",
            
          );
          price = parseFloat(price).toFixed(2);
          setCg8Price(price);
          let cg8Balance: any = await cGateBalance(address);
          cg8Balance = parseFloat(cg8Balance)?.toFixed(2);
          setCg8Balance(cg8Balance);
          let amount = await getUsdcToClaimed(address);
          amount = parseFloat(amount).toFixed(2);
          setAmountToClaim(amount);
          const user: any = await userDetails(address);
          const res: any = convertToEther(Number(user[1]));
          setTotalDeposit(parseFloat(res).toFixed(2));

          const login = await loginUser(address, cg8Balance, res, amount);
          console.log("login res is", login);
        }
      } catch (e) {
        console.log("error is---->", e);
      }
    };
    fetchAccountDetails();
  }, [address, isConnected]);

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

  return (
    <>
      <div
        className={`lg:ml-[205px]  lg:pl-1 w-full text-left text-teal mx-auto overflow-hidden ${
          openHistoryPrice ? "pointer-events-none blur-lg" : ""
        }`}
      >
        {/* <div className="absolute -z-10 lg:overflow-hidden lg:h-screen h-full">
          <img className=" w-full " src={bg} alt="" />
        </div> */}
        <div className=" md:mb-20 mb-16 text-2xl text-gray-50 md:pl-10 pl-4 mt-24">
          <Header heading="CGate DeFi Dashboard" />
        </div>

        <div className="md:flex w-[93%] md:w-full mx-auto lg:pl-10  -mt-10 md:mt-0  ">
          {/* -----------------------------------1st C A R D   S T A R T S   H E R E  ------------------- */}
          <div className="w-full mr-10 border bg-white bg-colors-white md:h-[440p] md:w-[650px] overflow-hidden md:flex flex-col items-center justify-start shadow-xl  rounded-2xl mb-5 md:mb-0">
            <div className="self-stretch flex flex-col items-start justify-center py-1 px-7 ">
              <div className=" flex w-full justify-between pt-4">
                <div className="  text-[16px]  ">My CG8 summary</div>

                <button
                  onClick={() => {
                    setSetting(!setting);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="42"
                    height="24"
                    viewBox="0 0 42 24"
                    fill="none"
                  >
                    <path
                      d="M0 12C0 5.37258 5.37258 0 12 0H30C36.6274 0 42 5.37258 42 12C42 18.6274 36.6274 24 30 24H12C5.37258 24 0 18.6274 0 12Z"
                      fill="#CCFBF1"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.49509 9C7.86517 9 6.54102 10.3459 6.54102 11.9975C6.54102 13.6516 7.86517 15 9.49509 15C11.125 15 12.4492 13.6516 12.4492 11.9975C12.4492 10.3459 11.125 9 9.49509 9ZM20.538 9C18.9081 9 17.5839 10.3459 17.5839 11.9975C17.5839 13.6516 18.9081 15 20.538 15C22.1679 15 23.4921 13.6516 23.4921 11.9975C23.4921 10.3459 22.1679 9 20.538 9ZM28.6328 11.9975C28.6328 10.3459 29.957 9 31.5869 9C33.2168 9 34.541 10.3459 34.541 11.9975C34.541 13.6516 33.2168 15 31.5869 15C29.957 15 28.6328 13.6516 28.6328 11.9975Z"
                      fill="#0D9488"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {setting ? (
              <div
                ref={settingsRef}
                className="block bg-[#F5F6FE] border md:p-5 p-2  rounded-2xl absolute z-10 lg:left-[684px] left-[200px] mt-0 md:mt-10 md:w-52 shadow-xl text-teal-600 "
              >
                <button
                  className=" mt-2  "
                  onClick={() => {
                    setopenHistoryPrice(true);
                    setOpenCG8Details(false);
                  }}
                >
                  CG8 historical price
                </button>
                <button
                  className="mt-2 block "
                  onClick={() => {
                    setopenHistoryPrice(true);
                    setOpenCG8Details(true);
                  }}
                >
                  CG8 details
                </button>
              </div>
            ) : (
              ""
            )}

            {/* {openDetails ? (
							<div className='absolute z-20'>
								<CG8stats
									setOpenCG8Details={setOpenCG8Details}
									setSetting={setSetting}
								/>
							</div>
						) : (
							""
						)} */}

            <div className="self-stretch rounded-[10px] bg-white md:flex md:flex-row items-start justify-center p-6  py-4 gap-[48px]  ">
              <div className="">
                <div className="flex bg-blue-800 rounded-3xl">
                  <div className="flex-1 flex flex-col items-start justify-start gap-[3px]  rounded-3xl p-6 ">
                    <div className=" text-gray-50 font-medium ">
                      CG8 in wallet
                    </div>
                    {isConnected ? (
                      <b className=" text-3xl py-1 font-roboto text-gray-50 ">
                        {parseFloat(
                          Number(cG8Balance).toFixed(2)
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </b>
                    ) : (
                      <b className=" text-3xl py-1 font-roboto text-gray-50 ">
                        0.00
                      </b>
                    )}
                    {isConnected ? (
                      <div className=" text-sm text-gray-100 font-medium">
                        ~$
                        {parseFloat(
                          Number(cG8Balance * cg8Price).toFixed(2)
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    ) : (
                      <div className=" text-sm text-gray-100 font-medium">
                        ~$0.00
                      </div>
                    )}

                    <div className="self-stretch  bg-border opacity-[0]" />
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="120"
                      height="150"
                      viewBox="0 0 170 170"
                      fill="none"
                    >
                      <g opacity="0.2">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M85 0C38.0558 0 0 38.0558 0 85C0 131.944 38.0558 170 85 170C131.944 170 170 131.944 170 85C170 38.0558 131.944 0 85 0ZM43.6076 71.3532H30.3598L30.7732 69.0863C31.5325 64.9224 32.9238 61.1782 34.9653 57.8798C36.9881 54.5865 39.508 51.7906 42.5187 49.5024C45.5195 47.1967 48.8804 45.4544 52.5881 44.2706C56.2736 43.0858 60.1969 42.5 64.3477 42.5C71.1233 42.5 77.2395 44.0547 82.6494 47.2047C83.8067 46.5299 85.0106 45.9221 86.2605 45.3814C90.7223 43.4514 95.6043 42.5 100.883 42.5C105.219 42.5 109.292 43.1371 113.09 44.428C116.892 45.6867 120.302 47.4909 123.304 49.8497C126.329 52.1821 128.858 54.9842 130.88 58.2497C132.913 61.5078 134.308 65.1188 135.071 69.0656L135.513 71.3532H122.105L121.675 70.0751C120.88 67.7116 119.841 65.6178 118.565 63.7807L118.549 63.7579C117.303 61.9075 115.816 60.3378 114.083 59.0404L114.073 59.0332C112.376 57.745 110.431 56.7499 108.223 56.0576C106.025 55.3688 103.583 55.0142 100.883 55.0142C98.0361 55.0142 95.3753 55.4779 92.8893 56.4001C94.1549 58.1065 95.2962 59.9572 96.3131 61.9505C99.4888 68.1755 101.039 75.4918 101.039 83.8334C101.039 92.175 99.4888 99.4914 96.3131 105.716C95.3132 107.676 94.1929 109.499 92.9525 111.181C95.5797 112.159 98.4244 112.653 101.5 112.653C105.778 112.653 109.463 111.769 112.606 110.059C115.778 108.323 118.223 105.895 119.973 102.766C121.391 100.244 122.262 97.3301 122.547 93.9879H108.129V81.9234H135.57V92.0779C135.57 98.6982 134.113 104.553 131.132 109.57C128.198 114.551 124.136 118.411 118.988 121.137C113.861 123.841 108.015 125.167 101.5 125.167C94.4679 125.167 88.1798 123.606 82.6954 120.435C77.2741 123.603 71.1425 125.167 64.3477 125.167C60.1964 125.167 56.2728 124.581 52.587 123.396C48.8819 122.213 45.5228 120.484 42.5227 118.205L42.5146 118.199C39.5055 115.886 36.9862 113.078 34.9634 109.784C32.925 106.465 31.5334 102.723 30.7736 98.5827L30.3572 96.3137H43.6046L43.9239 97.8085C44.4396 100.223 45.3334 102.33 46.5919 104.153L46.595 104.158C47.8531 105.992 49.389 107.542 51.2123 108.814C53.0215 110.07 55.0401 111.025 57.2795 111.673C59.5294 112.324 61.8835 112.653 64.3477 112.653C67.2594 112.653 69.9728 112.19 72.4996 111.27C71.239 109.56 70.1072 107.704 69.1046 105.704L69.1015 105.698C66.0094 99.4774 64.5 92.1678 64.5 83.8334C64.5 77.5807 65.3606 71.8981 67.1145 66.8108L67.1166 66.8049C68.4722 62.9125 70.2616 59.437 72.4919 56.3936C69.9672 55.4762 67.2564 55.0142 64.3477 55.0142C61.8835 55.0142 59.5294 55.3426 57.2795 55.9939C55.0451 56.6407 53.0303 57.6054 51.2232 58.8826L51.2014 58.8976C49.3836 60.1432 47.8513 61.6781 46.5951 63.5092L46.5857 63.5227C45.334 65.3141 44.4409 67.4146 43.9247 69.8547L43.6076 71.3532ZM80.6078 67.8831C81.259 66.567 81.9759 65.3557 82.7579 64.2467C83.5487 65.3569 84.2741 66.5696 84.9337 67.8872C87.0274 72.1202 88.1212 77.4086 88.1212 83.8334C88.1212 90.2584 87.0273 95.5469 84.9335 99.78C84.2837 101.078 83.5699 102.275 82.7926 103.371C82.0096 102.273 81.2928 101.075 80.6424 99.7759C78.5246 95.5441 77.4182 90.2574 77.4182 83.8334C77.4182 77.4065 78.5128 72.1169 80.6078 67.8831Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
                <div className="rounded-3xl  bg-teal-600 md:mt-3 mt-1 text-center w-[95%] mx-auto ">
                  {isConnected ? (
                    <button
                      className="text-white bg-teal-600  py-3 rounded-3xl w-full  text-sm mx-auto "
                      onClick={() => {
                        navigate("/swap");
                      }}
                    >
                      Buy CG8
                    </button>
                  ) : (
                    <div className="flex justify-center items-center  -mr-2">
                      <ConnectButton />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex bg-blue-800 rounded-3xl mt-5 md:mt-0">
                  <div className="flex-1 flex flex-col items-start justify-start gap-[3px]  rounded-3xl p-6">
                    <div className=" font-medium text-gray-50 whitespace-nowrap">
                      USDC to claim
                    </div>
                    {isConnected ? (
                      <>
                        <b className=" text-3xl py-1 font-roboto  text-gray-50">
                          {amountToClaim}
                        </b>
                        <div className=" text-sm text-gray-300 font-medium">
                          ~$ {amountToClaim}
                        </div>
                      </>
                    ) : (
                      <>
                        <b className=" text-3xl py-1 font-roboto  text-gray-50">
                          0.00
                        </b>
                        <div className=" text-sm text-gray-300 font-medium">
                          ~$0.00
                        </div>
                      </>
                    )}

                    <div className="self-stretch  bg-border  opacity-[0]" />
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="120"
                      height="150"
                      viewBox="0 0 170 170"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M85 170C132.104 170 170 132.104 170 85C170 37.8956 132.104 0 85 0C37.8956 0 0 37.8956 0 85C0 132.104 37.8956 170 85 170ZM66.9385 135.647C39.3135 125.73 25.1466 94.918 35.418 67.6466C40.7305 52.7716 52.418 41.4385 66.9385 36.126C68.3555 35.418 69.0635 34.3555 69.0635 32.5841V27.626C69.0635 26.2091 68.3555 25.1466 66.9385 24.793C66.5841 24.793 65.876 24.793 65.5216 25.1466C31.876 35.7716 13.4591 71.543 24.0841 105.189C30.4591 125.022 45.6885 140.251 65.5216 146.626C66.9385 147.334 68.3555 146.626 68.7091 145.209C69.0635 144.855 69.0635 144.501 69.0635 143.793V138.834C69.0635 137.772 68.001 136.355 66.9385 135.647ZM104.48 25.1466C103.064 24.4385 101.647 25.1466 101.293 26.5635C100.939 26.918 100.939 27.2716 100.939 27.9805V32.9385C100.939 34.3555 102.001 35.7716 103.064 36.4805C130.689 46.3966 144.855 77.2091 134.584 104.48C129.272 119.355 117.584 130.689 103.064 136.001C101.647 136.709 100.939 137.772 100.939 139.543V144.501C100.939 145.918 101.647 146.98 103.064 147.334C103.418 147.334 104.126 147.334 104.48 146.98C138.126 136.355 156.543 100.584 145.918 66.9385C139.543 46.751 123.959 31.5216 104.48 25.1466ZM86.0596 80.0429C100.935 81.8134 108.372 86.0634 108.372 98.459C108.372 108.021 101.289 115.459 90.6641 117.23V125.73C90.3096 127.501 89.2471 128.563 87.8302 128.563H82.5177C80.7471 128.209 79.6846 127.146 79.6846 125.73V117.23C67.9971 115.459 62.3302 109.084 60.9141 100.23V99.8759C60.9141 98.459 61.9766 97.3965 63.3927 97.3965H69.4141C70.4766 97.3965 71.5391 98.1054 71.8927 99.5215C72.9552 104.834 76.1427 108.73 85.3516 108.73C92.0802 108.73 97.0391 104.835 97.0391 99.1679C97.0391 93.5009 93.8516 91.3759 83.9346 89.6054C69.0596 87.834 61.9766 83.2304 61.9766 71.5429C61.9766 62.6884 68.7052 55.6054 79.3302 54.1884V46.0429C79.6846 44.2715 80.7471 43.209 82.1641 43.209H87.4766C89.2471 43.5634 90.3096 44.6259 90.3096 46.0429V54.5429C98.4552 55.2509 104.83 61.2715 106.247 69.0634V69.4179C106.247 70.834 105.185 71.8965 103.768 71.8965H98.1016C97.0391 71.8965 95.9766 71.1884 95.6221 70.1259C93.8516 64.8134 90.3096 62.6884 83.9346 62.6884C76.8516 62.6884 73.3096 65.8751 73.3096 70.834C73.3096 75.7929 75.4346 78.6259 86.0596 80.0429Z"
                        fill="white"
                        fill-opacity="0.1"
                      />
                    </svg>
                  </div>
                </div>

                {isConnected ? (
                  <div
                    className={`rounded-3xl bg-teal md:mt-3 text-center mt-1 w-[95%] mx-auto border-teal-500 text-teal-600 ${
                      !isConnected ? " border" : "border"
                    }`}
                  >
                    {" "}
                    <button
                      className="   py-3  rounded-3xl full  text-[14px] md:ml-1 "
                      onClick={() => {
                        navigate("/deposit");
                      }}
                    >
                      Deposit CG8
                    </button>
                  </div>
                ) : (
                  <div
                    className={`rounded-3xl bg-teal md:mt-3 text-center mt-1 w-[95%] mx-auto${
                      !isConnected ? " border" : "border"
                    }`}
                  >
                    <button className=" py-3  rounded-3xl full  text-[14px] md:ml-1 ">
                      Deposit CG8
                    </button>{" "}
                  </div>
                )}
              </div>
            </div>
            <div className="self-stretch flex flex-col items-center justify-start p-6 py-4 gap-[8px] text-colors-neutral-800 border-t-[1px] border-solid border-border text-sm">
              <div className="self-stretch flex flex-row items-center justify-start gap-[24px] leading-6">
                <div className="flex-1    mix-blend-normal">Earnings YTD</div>
                <div className="flex flex-row items-center justify-end text-right text-sub-heading">
                  <div className="relativ  ">0.00 USDC</div>
                </div>
              </div>
              <div className="self-stretch flex flex-row items-center justify-start gap-[20px] leading-6">
                <div className="flex-1   mix-blend-normal">
                  Earnings last year
                </div>
                <div className="flex flex-row items-start justify-start text-right">
                  <div className="relativ ">0.00 USDC</div>
                </div>
              </div>
              <div className="self-stretch flex flex-row items-center justify-end gap-[24px] leading-6">
                <div className="flex-1  ">My deposited CG8</div>
                <div className="flex flex-row items-start justify-start text-right ">
                  {isConnected ? (
                    <div className="relativ  ">{totalDeposit}</div>
                  ) : (
                    "0.00"
                  )}
                </div>
              </div>
              <div className="self-stretch flex flex-row items-center justify-end gap-[24px] leading-6">
                <div className="flex-1   ">My sales tax </div>
                <div className="flex flex-row items-start justify-start text-right text-sub-heading">
                  <div className="  ">0%</div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------1st C A R D   E N D   H E R E  ------------------- */}

          {/* -------------------------------------2nd C A R D (side)  S T A R T   H E R E  ------------------- */}
          {/* <div className=" bg-colors-white w-[100%]   md:w-[421px] md:h-[440p] overflow-hidden flex flex-col items-center justify-start shadow-xl border rounded-2xl bg-white text-sm ">
            <div className="self-stretch flex flex-col items-start justify-center py-1 px-6 border-b-[1px] border-solid border-tertiary">
              <div className="self-stretch flex flex-row items-center justify-end gap-[10px]">
                <div className="flex-1  text-xl leading-[40px] font-body-b1-regular text-heading">
                  General CG8 stats
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-start p-6 gap-[1px] mt-[-10px] text-neutral-800 font-body-b1-regular">
              <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 md:gap-[24px]">
                <div className="flex-1    inline-block h-[25px] ">
                  CG8 price
                </div>
                <div className="flex flex-row items-center justify-start gap-[5px] text-right text-sub-heading">
                  <div className="relativ  ">${cg8Price} USDC</div>
                </div>
              </div>
              <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
                <div className="flex-1  inline-block h-[25px] ">Market cap</div>
                <div className="flex flex-row items-start justify-start text-right">
                  <div className="relativ  ">$ 1.09M</div>
                </div>
              </div>
              <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
                <div className="flex-1  inline-block h-[25px] mix-blend-normal">
                  Token holders
                </div>
                <div className="flex flex-row items-start justify-start text-right text-sub-heading">
                  <div className="relativ leading-[24px] ">5,621</div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
                <div className=" leading-[24px]  md:w-[294px] h-[25px]  ">
                  Monthly CG8 Trade volume
                </div>
                <div className="flex flex-row items-start justify-start text-right text-sub-heading">
                  <div className="relativ">
                    <p className="m-0 ">8.1M</p>
                    <p className="m-0 text-xs  text-colors-neutral-600">
                      (~$ 8.1M)
                    </p>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
                <div className="flex-1   inline-block h-[25px] mix-blend-normal">
                  <span>{`Sales tax `}</span>
                  <span className="[text-decoration:underline] text-colors-primary-600">
                    (?)
                  </span>
                </div>
                <div className="flex flex-row items-start justify-start text-right text-sub-heading">
                  <div className=" leading-[24px] ">0%-50%</div>
                </div>
              </div>
              <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
                <div className="flex-1  leading-[24px]  inline-block h-[25px] mix-blend-normal">
                  Total staked CG8
                </div>
                <div className="flex flex-row items-start justify-start text-right text-sub-heading">
                  <div className=" leading-[24px]">
                    <p className="m-0">
                      <span>
                        <span className="">{totalDeposit}</span>
                      </span>
                    </p>
                    <p className="m-0 text-xs text-slategray">
                      <span>
                        <span className="font-body-b1-regular">{` `}</span>
                      </span>
                      <span className="">(~${totalDeposit * cg8Price})</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
                <div className="flex-1  leading-[24px] inline-block h-[25px] mix-blend-normal">
                  Total rewards USDC
                </div>
                <div className="flex flex-row items-start justify-start text-right text-sub-heading">
                  <div className=" leading-[24px]">
                    <p className="m-0 ">1.00</p>
                    <p className="m-0 text-xs  text-slategray">(~$ 1.00)</p>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
                <div className="flex-1  leading-[24px]  inline-block h-[25px] mix-blend-normal">
                  Max CG8 transaction size
                </div>
                <div className="flex flex-row items-start justify-start text-right text-sub-heading">
                  <div className=" leading-[24px] ">10,000</div>
                </div>
              </div>
              <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
                <div className="flex-1  leading-[24px] mix-blend-normal">
                  Highest staking APR
                </div>
                <div className="w-6 flex flex-row items-start justify-start text-right text-sub-heading">
                  <div className="flex-1  leading-[24px]">5%</div>
                </div>
              </div>
            </div>
          </div> */}
          {/* -------------------------------------2nd C A R D (side)  E N D  H E R E  ------------------- */}
        </div>
      </div>
      {openHistoryPrice ? (
        <div>
          <HistoricalPrice
            setopenHistoryPrice={setopenHistoryPrice}
            setSetting={setSetting}
            openCG8Details={openCG8Details}
            setOpenCG8Details={setOpenCG8Details}
          />
        </div>
      ) : (
        ""
      )}
      {openDetails ? "" : ""}
    </>
  );
};

export default Frame;
