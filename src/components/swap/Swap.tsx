/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, useEffect, useState } from "react";
import { useRef } from "react";
import { ethers } from "ethers";
import bg from "../../assets/Master-bg.svg";
import logo from "./assets/coin.svg";
import CG8 from "../../assets/CG8.svg";
import hr from "./assets/Vector 115.svg";
import Header from "../Header/Header";
import gas from "./assets/gas-station-fill.svg";
import Settings from "./Settings";
import SwapHistory from "./SwapHistory";
import { toast } from "react-toastify";
import { ConnectWallet } from "../Header/ConnectWallet.js";
import { useAccount } from "wagmi";
import {
  cGateBalance,
  getUsdcBalance,
  buyCG8,
  getAmountOut,
  getAmountIn,
  checkAllowance,
  approveToken,
  getMinAmountOut,
  buyUsdc,
  estimateSlippage,
  getMinAmountIn,
} from "../../utils/web3Utils.js";
import { addSwapHistory } from "../../utils/apiServices.js";
import {
  PANCAKE_TEST_ROUTER_CONTRACT,
  TOKEN_CONTRACT,
  USDC_CONTRACT,
} from "../../constants/contracts";
import { ThreeCircles } from "react-loader-spinner";
import TOKEN_ABI from "../../constants/tokenABI.json";
import USDC_ABI from "../../constants/usdcABI.json";
const Swap: FunctionComponent = () => {
  const [setting, setSetting] = useState(false);
  const [openSettings, setopenSettings] = useState(false);
  const [openHistory, setopenHistory] = useState(false);
  const { address, isConnected } = useAccount();
  const [cg8Balance, setCg8Balance] = useState(0.0);
  const [usdcBalance, setUSDCBalance] = useState(0.0);
  const [cg8Value, setCg8Value] = useState<any>();
  const [usdcValue, setUsdcValue] = useState<any>();
  const [loader, setLoader] = useState(false);
  const [isApprove, setIsApprove] = useState(true);
  const [cg8Price, setCg8Price] = useState<any>();
  const [isCg8Buy, setIsCg8cBuy] = useState(true);
  const [deadlineTime, setDeadlineTime] = useState<any>(0);

  const settingsRef: any = useRef(null);

  const closeSettings = () => {
    setSetting(false);
    setopenSettings(false);
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
    const getCG8Balance = async () => {
      let price: any = await getMinAmountIn("1");
      price = parseFloat(price).toFixed(2);
      setCg8Price(price);
      console.log("price of cgs is---->", price);
      if (isConnected) {
        const res: any = await cGateBalance(address);
        console.log("res cgate----->", res);
        setCg8Balance(parseFloat(res));
        const usdc: any = await getUsdcBalance(address);
        setUSDCBalance(parseFloat(usdc));
      }
    };
    getCG8Balance();
  }, [isConnected, address]);

  const handleCg8ValueChange = async (e) => {
    const value = e.target.value;

    setCg8Value(value);
    try {
      // console.log("data for checkin allowance is----->", data1);
      const allowance: any = await checkAllowance(
        address,
        PANCAKE_TEST_ROUTER_CONTRACT,
        USDC_CONTRACT,
        USDC_ABI
      );
      if (isCg8Buy) {
        const allowance: any = await checkAllowance(
          address,
          PANCAKE_TEST_ROUTER_CONTRACT,
          USDC_CONTRACT,
          USDC_ABI
        );

        const data1: any = await getAmountOut(
          value,

          TOKEN_CONTRACT,
          USDC_CONTRACT
        );
        const data3 = await getMinAmountIn(value);
        console.log("amount in max value is---->", data3);
        const data2 = await getAmountIn(value, TOKEN_CONTRACT, USDC_CONTRACT);
        console.log("out amount data1 is----->", data1);
        console.log("in amount data2 is----->", data2);
        setUsdcValue(Number(data3));
        if (data1 > usdcBalance) {
          toast.error("You dont Have Enough USDC");
          setCg8Value(0);
          setUsdcValue(0);
          return;
        }
        if (parseFloat(allowance) < parseFloat(data1)) {
          setIsApprove(false);
        } else {
          setIsApprove(true);
        }
      } else {
        const data1: any = await getAmountOut(
          value,

          TOKEN_CONTRACT,
          USDC_CONTRACT
        );
        const data2 = await getMinAmountOut(value);
        console.log("data 2 is----->", data2);
        console.log("out amount data is----->", data1);
        setUsdcValue(Number(data1));
        if (data1 > usdcBalance) {
          toast.error("You dont Have Enough USDC");
          setCg8Value(0);
          setUsdcValue(0);
          return;
        }
        if (parseFloat(allowance) < parseFloat(data1)) {
          setIsApprove(false);
        } else {
          setIsApprove(true);
        }
      }
    } catch (e) {
      console.log("error is---->", e);
    }
  };
  const handleUsdcValueChange = async (e) => {
    const value = e.target.value;
    console.log("value and event is---->", value);
    setUsdcValue(value);

    try {
      const allowance: any = await checkAllowance(
        address,
        PANCAKE_TEST_ROUTER_CONTRACT,
        USDC_CONTRACT,
        USDC_ABI
      );
      console.log("allowance of usdc is----->", allowance);
      if (isCg8Buy) {
        const data1: any = await getAmountIn(
          value,
          TOKEN_CONTRACT,
          USDC_CONTRACT
        );
        console.log("out amount data is----->", data1);
        const data2 = await getMinAmountOut(value);
        console.log("Value minimum amount out data is", data2);

        setCg8Value(data2);
        if (value > usdcBalance) {
          toast.error("You dont Have Enough USDC");
          setCg8Value(0.0);
          setUsdcValue(0.0);
          return;
        }
        if (allowance < value) {
          setIsApprove(false);
        } else {
          setIsApprove(true);
        }
      } else {
        const data1: any = await getAmountOut(
          value,
          USDC_CONTRACT,
          TOKEN_CONTRACT
        );
        console.log("out amount data is----->", data1);

        const data2 = await getMinAmountOut(value);
        console.log("data 2 is agian is ------>", data2);

        setCg8Value(data1);
        if (value > usdcBalance) {
          toast.error("You dont Have Enough USDC");
          setCg8Value(0.0);
          setUsdcValue(0.0);
          return;
        }
        if (allowance < value) {
          setIsApprove(false);
        } else {
          setIsApprove(true);
        }
      }
    } catch (e) {
      console.log("error is---->", e);
    }
  };

  const buyCgate = async () => {
    try {
      const slippage = await estimateSlippage(
        USDC_CONTRACT,
        TOKEN_CONTRACT,
        usdcValue
      );
      console.log("Slippage value is", slippage);

      setLoader(true);
      const res: any = await buyCG8(
        cg8Value,
        USDC_CONTRACT,
        TOKEN_CONTRACT,
        address
      );

      if (res.status == "success") {
        toast.success("Transaction Successfull");
        const swap = await addSwapHistory(address, cg8Value, usdcValue);

        setCg8Value(0);
        setUsdcValue(0);
        setLoader(false);
        window.location.reload();
      } else {
        toast.error("Transaction Failed");
        setLoader(false);
        setCg8Value(0);
        setUsdcValue(0);
        window.location.reload();
      }
    } catch (e) {
      setLoader(false);
      setCg8Value(0);
      setUsdcValue(0);
    }
  };
  const buyUSDC = async () => {
    try {
      setLoader(true);
      const res: any = await buyUsdc(
        usdcValue,
        TOKEN_CONTRACT,
        USDC_CONTRACT,
        address
      );

      if (res.status == "success") {
        toast.success("Transaction Successfull");
        const swap = await addSwapHistory(address, usdcValue, cg8Value);
        console.log("swap api response", swap);
        setCg8Value(0);
        setUsdcValue(0);
        setLoader(false);
        window.location.reload();
      } else {
        toast.error("Transaction Failed");
        setLoader(false);
        setCg8Value(0);
        setUsdcValue(0);
        window.location.reload();
      }
    } catch (e) {
      setLoader(false);
      setCg8Value(0);
      setUsdcValue(0);
    }
  };

  const approve = async () => {
    try {
      setLoader(true);
      const res = await approveToken(
        address,
        PANCAKE_TEST_ROUTER_CONTRACT,
        USDC_CONTRACT,
        USDC_ABI
      );

      if (res.status == "success") {
        toast.success("Approved Successful");
        await buyCgate();
        setCg8Value(0);
        setUsdcValue(0);
        setLoader(false);
      } else {
        toast.error("Transaction Failed");
        setLoader(false);
        setCg8Value(0);
        setUsdcValue(0);
      }
    } catch (e) {
      toast.error("Something went wrong");
      setLoader(false);
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
      <div className="fixed -z-10  ">
        <img className="fixed w-full h-[1500px] md:h-auto" src={bg} alt="" />
      </div>
      <div
        className={`relative w-full  text-left text-base text-sub-heading font-xl ml-4 md:ml-[250px] ${
          openSettings || openHistory
            ? " bg-gray-400 pointer-events-none blur-lg"
            : ""
        }`}
      >
        <div className=" h-full   rounded-xl  overflow-hidden w-full -ml-1 md:ml-0 pt-20">
          <div className="mb-10 md:mb-2">
            <Header heading="Swap CG8-USDC" />
          </div>

          <div className="border  md:left-0 p-4 -mt-5 md:mt-0 rounded-xl  bg-[#F5F6FE] shadow-xl w-[96%]   md:w-[600px] flex flex-col items-center justify-start md:p-4 gap-[24px] text-black">
            <div className="self-stretch flex flex-row items-center justify-start ">
              <div className="flex-1 flex flex-row items-center justify-end ">
                <div className="flex-1 relative  font-medium text-[16px] ">
                  Swap CG8-USDC
                </div>
              </div>
              <button>
                <svg
                  className={`  px-2 ${
                    setting ? "bg-blue-200  rounded-3xl" : ""
                  }`}
                  onClick={() => {
                    setSetting(!setting);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  viewBox="0 0 42 24"
                  fill="none"
                >
                  <path
                    d="M0 12C0 5.37258 5.37258 0 12 0H30C36.6274 0 42 5.37258 42 12C42 18.6274 36.6274 24 30 24H12C5.37258 24 0 18.6274 0 12Z"
                    fill="white"
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

            {setting ? (
              <div
                ref={settingsRef}
                className="block bg-white border md:p-5 p-2  rounded-2xl absolute lg:left-[534px] left-[200px] md:mt-10 mt-5 md:w-52 shadow-xl text-teal-600 "
              >
                <button
                  className="pt-4 "
                  onClick={() => {
                    setopenHistory(true);
                  }}
                >
                  My swap history
                </button>
                <button
                  className="my-3 block"
                  onClick={() => {
                    window.open(
                      "https://pancakeswap.finance/swap?chain=bscTestnet"
                    );
                  }}
                >
                  Settings
                </button>
                <button
                  className=""
                  onClick={() => {
                    window.open(
                      "https://pancakeswap.finance/liquidity",
                      "_blank"
                    );
                  }}
                >
                  Liquidity
                </button>
              </div>
            ) : (
              ""
            )}
            <div className="self-stretch flex flex-col md:items-center justify-start gap-[10px] -mt-4">
              <div className="self-stretch flex flex-col items-start justify-start gap-[8px]">
                <b className="self-stretch relative leading-[24px] ">Buy</b>
                {isCg8Buy ? (
                  <div className="self-stretch rounded-2xl bg-gray-50 flex flex-row items-center justify-start py-2 px-5 gap-[20px] text-5xl border-[1px] border-gray-200">
                    <img
                      className=" w-[40.11px] h-[40.11px]"
                      alt=""
                      src={CG8}
                    />
                    <div className="block md:mr-28  text-xl">
                      <input
                        className="md:w-[100px] w-20 bg-gray-50"
                        placeholder="CG8"
                        type="number"
                        value={cg8Value}
                        onChange={handleCg8ValueChange}
                      ></input>
                    </div>
                    <button
                      className="relativ text-base  font-medium text-teal-600"
                      onClick={async () => {
                        setCg8Value(cg8Balance);
                        const r1 = await getMinAmountOut(cg8Balance.toString());

                        setUsdcValue(r1);
                      }}
                    >
                      MAX
                    </button>
                    <img
                      className="self-stretch  max-h-full w-1px "
                      alt=""
                      src={hr}
                    />
                    <div className="block  text-left overflow-auto">
                      <select
                        name=""
                        id=""
                        className="bg-gray-50 text-xl  md:pr-24   text-left"
                      >
                        {/* <option value=""></option> */}
                        <option value="CGate">CG8</option>
                      </select>
                      <p className="text-xs md:text-left  md:flex ml-1 md:ml-1 block  ">
                        Balance:
                        <span className="flex ">
                          {parseFloat(
                            Number(cg8Balance).toFixed(2)
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                         
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="self-stretch rounded-2xl bg-gray-50 flex flex-row items-center justify-start py-2 px-5 gap-[20px] text-5xl border-[1px] border-solid ">
                    <img
                      className=" w-[40.11px] h-[40.11px]"
                      alt=""
                      src={logo}
                    />

                    <div className=" md:mr-28 text-xl block">
                      <input
                        className="md:w-[100px] w-20 bg-gray-50"
                        placeholder="USDC"
                        type="number"
                        value={usdcValue}
                        onChange={handleUsdcValueChange}
                      ></input>
                    </div>
                    <button
                      className="relativ text-base leading-[24px] font-medium text-teal-600"
                      onClick={() => {
                        setUsdcValue(usdcBalance);
                      }}
                    >
                      MAX
                    </button>
                    <img
                      className="self-stretch relativ max-h-full w-1px "
                      alt=""
                      src={hr}
                    />
                    <div className="block  text-left overflow-auto ">
                      <select
                        name=""
                        id=""
                        className="bg-gray-50 text-xl md:px- text-left  md:pr-20 "
                      >
                        {/* <option value=""></option> */}
                        <option value="USDC">USDC</option>
                      </select>
                      <p className="text-xs md:text-left md:flex ml-1 block ">
                        Balance:
                        <span className="flex overflow-scroll">
                          {usdcBalance?.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="self-stretch flex flex-col items-center justify-start">
                  <button
                    onClick={() => {
                      setIsCg8cBuy(!isCg8Buy);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      fill="none"
                    >
                      <path
                        d="M21.9999 43.3333C33.9599 43.3333 43.6666 33.6266 43.6666 21.6666C43.6666 9.70658 33.9599 -8.39233e-05 21.9999 -8.39233e-05C10.0399 -8.39233e-05 0.333252 9.70658 0.333252 21.6666C0.333252 33.6266 10.0399 43.3333 21.9999 43.3333ZM24.1666 21.6666V30.3333H19.8333V21.6666H13.3333L21.9999 12.9999L30.6666 21.6666H24.1666Z"
                        fill="#0D9488"
                      />
                    </svg>
                  </button>

                  <div className="self-stretch flex flex-col items-start justify-start gap-[8px] mt-[-22px]">
                    <b className="self-stretch relative leading-[24px] mix-blend-normal">
                      Sell
                    </b>
                  </div>
                </div>
                {isCg8Buy ? (
                  <div className="self-stretch rounded-2xl bg-gray-50 flex flex-row items-center justify-start py-2 px-5 gap-[20px] text-5xl border-[1px] border-solid ">
                    <img
                      className=" w-[40.11px] h-[40.11px]"
                      alt=""
                      src={logo}
                    />

                    <div className=" md:mr-28 text-xl block">
                      <input
                        className="md:w-[100px] w-20 bg-gray-50"
                        placeholder="USDC"
                        type="number"
                        value={usdcValue}
                        onChange={handleUsdcValueChange}
                      ></input>
                    </div>
                    <button
                      className="relativ text-base leading-[24px] font-medium text-teal-600"
                      onClick={() => {
                        setUsdcValue(usdcBalance);
                      }}
                    >
                      MAX
                    </button>
                    <img
                      className="self-stretch relativ max-h-full w-1px "
                      alt=""
                      src={hr}
                    />
                    <div className="block  text-left overflow-auto ">
                      <select
                        name=""
                        id=""
                        className="bg-gray-50 text-xl md:px- text-left  md:pr-20 "
                      >
                        {/* <option value=""></option> */}
                        <option value="USDC">USDC</option>
                      </select>
                      <p className="text-xs md:text-left md:flex ml-1 block ">
                        Balance:
                        <span className="flex overflow-scroll">
                          {parseFloat(
                            Number(usdcBalance).toFixed(2)
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="self-stretch rounded-2xl bg-gray-50 flex flex-row items-center justify-start py-2 px-5 gap-[20px] text-5xl border-[1px] border-gray-200">
                    <img
                      className=" w-[40.11px] h-[40.11px]"
                      alt=""
                      src={CG8}
                    />
                    <div className="block md:mr-28  text-xl">
                      <input
                        className="md:w-[100px] w-20 bg-gray-50"
                        placeholder="CG8"
                        type="number"
                        value={cg8Value}
                        onChange={handleCg8ValueChange}
                      ></input>
                    </div>
                    <button
                      className="relativ text-base  font-medium text-teal-600"
                      onClick={async () => {
                        setCg8Value(cg8Balance);
                        const r1 = await getMinAmountOut(cg8Balance.toString());

                        setUsdcValue(r1);
                      }}
                    >
                      MAX
                    </button>
                    <img
                      className="self-stretch  max-h-full w-1px "
                      alt=""
                      src={hr}
                    />
                    <div className="block  text-left overflow-auto">
                      <select
                        name=""
                        id=""
                        className="bg-gray-50 text-xl  md:pr-24   text-left"
                      >
                        {/* <option value=""></option> */}
                        <option value="CGate">CG8</option>
                      </select>
                      <p className="text-xs md:text-left  md:flex ml-1 md:ml-1 block  ">
                        Balance:
                        <span className="flex ">
                          {parseFloat(
                            Number(cg8Balance).toFixed(2)
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:flex text-sm font-light md:gap-60 my-3">
              <div className="text-left">
                <p>1.00 CG8 = {cg8Price} USDC</p>
              </div>
              {/* <div className="flex gap-1 md:align-center  ">
                <img src={gas} alt="" />
                <p className="mt-1 font-normal">$0.1</p>
              </div> */}
            </div>

            {isConnected ? (
              <>
                {isApprove ? (
                  <>
                    {isCg8Buy ? (
                      <button
                        className="self-stretch rounded-3xl flex flex-row items-center justify-center text-sm text-white"
                        onClick={buyCgate}
                      >
                        <div className="flex-1 rounded-3xl bg-teal-600 flex flex-row items-center justify-center p-4 gap-[8px]">
                          <div className="relative leading-[15px]  ">
                            Buy CG8
                          </div>
                        </div>
                      </button>
                    ) : (
                      <button
                        className="self-stretch rounded-3xl flex flex-row items-center justify-center text-sm text-white"
                        onClick={buyUSDC}
                      >
                        <div className="flex-1 rounded-3xl bg-teal-600 flex flex-row items-center justify-center p-4 gap-[8px]">
                          <div className="relative leading-[15px]  ">
                            Buy USDC
                          </div>
                        </div>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      className="self-stretch rounded-3xl flex flex-row items-center justify-center text-sm text-white"
                      onClick={approve}
                    >
                      <div className="flex-1 rounded-3xl bg-teal-600 flex flex-row items-center justify-center p-4 gap-[8px]">
                        <div className="relative leading-[15px]  ">
                          Approve USDC
                        </div>
                      </div>
                    </button>
                  </>
                )}
              </>
            ) : (
              <ConnectWallet></ConnectWallet>
            )}
          </div>
        </div>
      </div>
      {openSettings ? (
        <Settings
          setOpenSettings={setopenSettings}
          setSetting={setSetting}
          settingsRef={settingsRef}
          setDeadlineTime={setDeadlineTime}
        />
      ) : null}
      {openHistory ? (
        <SwapHistory setOpenHistory={setopenHistory} setSetting={setSetting} />
      ) : null}
    </>
  );
};

export default Swap;
