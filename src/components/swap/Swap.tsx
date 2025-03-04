/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, useEffect, useState } from "react";
import { useRef, useContext, useCallback } from "react";
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
import { debounce } from "lodash";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import {
  cGateBalance,
  getUsdcBalance,
  buyCG8,
  getAmountOut,
  getAmountIns,
  checkAllowance,
  approveToken,
  getMinAmountOut,
  buyUsdc,
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
import { appContext } from "../../context/context.jsx";

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
  const [insufficientUSDC, setInsufficientUSDC] = useState(false);
  const [insufficientCG8, setInsufficientCG8] = useState(false);
  const [deadlineTime, setDeadlineTime] = useState<any>(0);
  const [insufficientLiquidity, setInsufficientLiquidity] = useState(false);
  const myContext = useContext<any>(appContext);
  const settingsRef: any = useRef(null);
  const latestUsdcValue = useRef("");
  const latestCg8Value = useRef("");

  const closeSettings = () => {
    setSetting(false);
    setopenSettings(false);
  };

  const toggleBuySell = async () => {
    let beforeCg8Buy = isCg8Buy;
    console.log("is Cg8 buy before", beforeCg8Buy);
    if (isCg8Buy == true) {
      setIsCg8cBuy(false);
      beforeCg8Buy = false;
    } else {
      setIsCg8cBuy(true);
      beforeCg8Buy = true;
    }

    console.log("is Cg8 buy after", beforeCg8Buy);

    setCg8Value(0);
    setUsdcValue(0);
    setInsufficientCG8(false);
    setInsufficientUSDC(false);
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
      const price = myContext?.trade?.outputAmount.toExact();

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
  }, [isConnected, address, myContext]);

  const debouncedHandleCg8ValueChange = useCallback(
    debounce(async (value) => {
      value = latestCg8Value.current;

      console.log("Debounced function called with CG8 value:", value);

      if (value === "" || Number(value) === 0) {
        console.log("empty value", value);
        setCg8Value("");
        setUsdcValue("");
        return;
      }

      try {
        if (isCg8Buy) {
          console.log("here is called");
          const allowance: any = await checkAllowance(
            address,
            PANCAKE_TEST_ROUTER_CONTRACT,
            USDC_CONTRACT,
            USDC_ABI
          );
          console.log("allowance is---->",allowance);
        
          let res = await myContext?.getBestRoute(value, "CG8", 0);
          
          if (latestCg8Value.current == "") {
            return;
          }
          const data3 = res?.outputAmount.toExact();

          if (parseFloat(data3) == 0) {
            setInsufficientLiquidity(true);
          } else {
            setInsufficientLiquidity(false);
          }

          setUsdcValue(data3);
          console.log("usdc balance is---->", usdcBalance);
          if (parseFloat(data3) > parseFloat(usdcBalance.toString())) {
            setInsufficientUSDC(true);
            setCg8Value("");
            setUsdcValue("");
            return;
          } else {
            setInsufficientUSDC(false);
          }

          setIsApprove(parseFloat(allowance) >= parseFloat(data3));
        } else {
          const allowance = await checkAllowance(
            address,
            PANCAKE_TEST_ROUTER_CONTRACT,
            TOKEN_CONTRACT,
            USDC_ABI
          );
             console.log("allowance is---->", allowance);

          let res = await myContext?.getBestRoute(value, "CG8", 0);
        
          const data3 = res?.outputAmount.toExact();

          setUsdcValue(data3);
          if (data3 > cg8Balance) {
            setInsufficientUSDC(false);
            setInsufficientCG8(true);
            setCg8Value("");
            setUsdcValue("");
            return;
          } else {
            setInsufficientCG8(false);
            setInsufficientUSDC(false);
          }
          setIsApprove(parseFloat(allowance.toString()) >= parseFloat(data3));
        }
      } catch (e) {
        console.log("error is---->", e);
      }
    }, 300),
    [isCg8Buy, usdcBalance, cg8Balance]
  );

  const handleCg8ValueChange = (e) => {
    console.log("in handle cg8 value change");
    let value = e.target.value;

    value = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    if (value.includes(".")) {
      const parts = value.split(".");
      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + "." + parts[1].slice(0, 2);
      }
    }

    setCg8Value(value);
    latestCg8Value.current = value;

    if (value === "" || Number(value) === 0) {
      console.log("empty value", value);
      setUsdcValue("");
      debouncedHandleCg8ValueChange.cancel(); // Cancel any pending debounced calls
    } else {
      debouncedHandleCg8ValueChange(value);
    }
  };

  const debouncedHandleValueChange = useCallback(
    debounce(async (value) => {
      // Ensure we're using the latest value
      value = latestUsdcValue.current;

      console.log("Debounced function called with value:", value);

      if (value === "" || Number(value) === 0) {
        console.log("empty value", value);
        setCg8Value("");
        return;
      }

      try {
        const allowance = await checkAllowance(
          address,
          PANCAKE_TEST_ROUTER_CONTRACT,
          USDC_CONTRACT,
          USDC_ABI
        );
        console.log("allowance is----->", allowance);
        if (isCg8Buy) {
          let res = await myContext?.getBestRoute(value, "USDC", 0);
          console.log("result of cg8 buy is----->", res?.inputAmount.toExact());
          const data2 = res?.outputAmount.toExact();

          setCg8Value(data2);
          if (Number(value) > usdcBalance) {
            setInsufficientUSDC(true);
            setCg8Value("");
            return;
          } else {
            setInsufficientUSDC(false);
          }
          setIsApprove(Number(allowance) >= Number(value));
        } else {
          console.log("value of usdc is----->", value, typeof value);
          let res = await myContext?.getBestRoute(value, "USDC", 1);

          console.log(
            "result of cg8 sell is----->",
            res?.inputAmount.toExact()
          );
          const data2 = res?.inputAmount.toExact();
          console.log("usdc value is", usdcValue, latestUsdcValue.current);
          console.log(
            "latestUsdcValue.current value is",

            latestUsdcValue.current
          );
          if (latestUsdcValue.current == "") {
            setCg8Value("");
            return;
          } else {
            console.log("data 2 is------>", data2);

            setCg8Value(data2);
          }
          // setCg8Value(data2);
          if (Number(value) > cg8Balance) {
            setInsufficientCG8(true);
            setCg8Value("");
            return;
          } else {
            setInsufficientCG8(false);
          }
          setIsApprove(Number(allowance) >= Number(value));
        }
      } catch (e) {
        console.log("error is---->", e);
      }
    }, 300),
    [isCg8Buy]
  );

  const handleUsdcValueChange = (e) => {
    console.log("in handleUsdcValueChanged", e.target.value);
    console.log("isCg8Buy", isCg8Buy);
    let value = e.target.value;

    value = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    if (value.includes(".")) {
      const parts = value.split(".");
      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + "." + parts[1].slice(0, 2);
      }
    }

    setUsdcValue(value);
    latestUsdcValue.current = value;

    if (value === "" || Number(value) === 0) {
      console.log("empty value", value);
      setCg8Value("");
      debouncedHandleValueChange.cancel(); // Cancel any pending debounced calls
    } else {
      debouncedHandleValueChange(value);
    }
  };

  const buyCgate = async () => {
    try {
      setLoader(true);
      let res1 = await myContext?.getBestRoute(usdcValue, "USDC", 0);
      let res2 = await myContext?.swap(address, res1);
      console.log("res of cg8 buy is---->", res2);
      if (res2.status == "success") {
        toast.success("Transaction Successfull");
        const swap = await addSwapHistory(address, cg8Value, usdcValue);

        setCg8Value("");
        setUsdcValue("");
        setLoader(false);
        window.location.reload();
      } else {
        toast.error("Transaction Failed");
        setLoader(false);
        setCg8Value("");
        setUsdcValue("");
      }
    } catch (e) {
      setLoader(false);
      setCg8Value("");
      setUsdcValue("");
    }
  };
  const buyUSDC = async () => {
    try {
      setLoader(true);
      let res1 = await myContext?.getBestRoute(usdcValue, "USDC", 1);
      let res2 = await myContext?.swap(address, res1);

      console.log("res2 is------>", res2);

      if (res2.status == "success") {
        toast.success("Transaction Successfull");
        const swap = await addSwapHistory(address, usdcValue, cg8Value);
        console.log("swap api response", swap);
        setCg8Value("");
        setUsdcValue("");
        setLoader(false);
        window.location.reload();
      } else {
        toast.error("Transaction Failed");
        setLoader(false);
        setCg8Value("");
        setUsdcValue("");
        // window.location.reload();
      }
    } catch (e) {
      setLoader(false);
      setCg8Value("");
      setUsdcValue("");
      // window.location.reload();
    }
  };

  const approve = async () => {
    try {
      setLoader(true);
      if (isCg8Buy) {
        const res = await approveToken(
          address,
          PANCAKE_TEST_ROUTER_CONTRACT,
          USDC_CONTRACT,
          USDC_ABI
        );

        if (res.status == "success") {
          toast.success("Approved Successful");
          if (isCg8Buy) {
            await buyCgate();
          } else {
            console.log("here in buy usdc");
            await buyUSDC();
          }

          setCg8Value(0);
          setUsdcValue(0);
          setLoader(false);
        } else {
          toast.error("Transaction Failed");
          setLoader(false);
          setCg8Value(0);
          setUsdcValue(0);
        }
      } else {
        const res = await approveToken(
          address,
          PANCAKE_TEST_ROUTER_CONTRACT,
          TOKEN_CONTRACT,
          USDC_ABI
        );

        if (res.status == "success") {
          toast.success("Approved Successful");
          if (isCg8Buy) {
            await buyCgate();
          } else {
            console.log("here in buy usdc");
            await buyUSDC();
          }

          setCg8Value(0);
          setUsdcValue(0);
          setLoader(false);
        } else {
          toast.error("Transaction Failed");
          setLoader(false);
          setCg8Value(0);
          setUsdcValue(0);
        }
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
        className={`relative  text-left text-base text-sub-heading font-xl ml-6 md:ml-[250px] ${
          openSettings || openHistory
            ? " bg-gray-400 pointer-events-none blur-lg"
            : ""
        }`}
      >
        <div className=" h-full   rounded-xl  overflow-hidden w-full -ml-1 md:ml-0 pt-20">
          <div className="mb-10 md:mb-2">
            <Header heading="Swap CG8-USDC" />
          </div>

          <div className="border md:left-0 p-4 -mt-5 md:mt-0 rounded-xl bg-[#F5F6FE] shadow-xl w-[96%] md:w-[600px] flex flex-col items-center justify-start md:p-4 gap-[24px] text-black overflow-y-auto max-h-[90vh] md:max-h-full">
            <div className="self-stretch flex flex-row items-center justify-start ">
              <div className="flex-1 flex flex-row items-center justify-end ">
                <div className="flex-1 relative  font-medium text-[16px] ">
                  Swap CG8-USDC
                </div>
              </div>
              <button>
                <svg
                  className={` px-2 ${
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
                className="block bg-white border md:p-5 p-2 z-50  rounded-xl absolute lg:left-[534px] left-[150px] md:mt-10 mt-12  md:w-52  shadow-xl text-teal-600 "
              >
                <button
                  className=" "
                  onClick={() => {
                    setopenHistory(true);
                  }}
                >
                  My swap history
                </button>
                <button
                  className="my-3 block"
                  onClick={() => {
                    setopenSettings(true);
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
            <div className="self-stretch flex flex-col md:items-center justify-start gap-[10px] -mt-4 ">
              <div className="self-stretch flex flex-col items-start justify-start gap-[8px] ">
                <b className="self-stretch relative leading-[24px] ">Buy</b>
                {isCg8Buy ? (
                  <div className="self-stretch rounded-2xl bg-gray-50 flex flex-row items-center justify-start py-2 md:px-5 px-2 gap-[20px] text-5xl border-[1px] border-gray-200">
                    <img
                      className=" md:block w-[40.11px] h-[40.11px]"
                      alt=""
                      src={CG8}
                    />
                    <div className="block md:mr-28  text-xl">
                      <input
                        className="md:w-[130px] w-[84px] -ml-2 md:ml-0 bg-gray-50 pl-2"
                        placeholder="CG8"
                        type="number"
                        value={cg8Value}
                        onChange={handleCg8ValueChange}
                      ></input>
                    </div>
                    {/* <button
                      className="relative text-base font-medium text-teal-600 -ml-2 md:ml-0 "
                      onClick={async () => {
                        setCg8Value(cg8Balance.toFixed(2));
                        const r1: any = await getMinAmountOut(
                          cg8Balance.toString()
                        );
                        setUsdcValue(r1.toFixed(2));
                      }}
                    >
                      MAX
                    </button> */}
                    <img
                      className="self-stretch  max-h-full w-1px "
                      alt=""
                      src={hr}
                    />
                    <div className="block  text-left overflow-auto -mt-2">
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
                        <span className="flex sm:px-1 px-0 ">
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
                  <div className="self-stretch rounded-2xl bg-gray-50 flex flex-row items-center justify-start py-2 md:px-5 px-2 gap-[20px] text-5xl border-[1px] border-solid  ">
                    <img
                      className=" w-[40.11px] h-[40.11px]"
                      alt=""
                      src={logo}
                    />

                    <div className="md:mr-28 text-xl block relative ">
                      <input
                        className="md:w-[130px]  w-[84px] -ml-2 md:ml-0 bg-gray-50 block pl-2 "
                        placeholder="USDC"
                        type="number"
                        value={usdcValue}
                        onChange={handleUsdcValueChange}
                      />
                      <div className="text-red-600 text-[16px] absolute  text-left  ">
                        {insufficientUSDC && (
                          <p
                            className="mb-2 absolute top-[210px] w-[200px] md:top-[205px] left-0 -ml-[80px]"
                            style={{
                              paddingLeft: "0.5rem",
                            }}
                          >
                            Insufficient USDC balance
                          </p>
                        )}
                        {insufficientCG8 && (
                          <p
                            className=" absolute top-[186px] md:top-[174px] flex w-[200px] -ml-[80px] "
                            style={{
                              paddingLeft: "0.5rem",
                            }}
                          >
                            Insufficient CG8 balance
                          </p>
                        )}

                        {/* {insufficientLiquidity && (
                          <p
                            className="mb-2"
                            style={{
                              paddingLeft: "0.5rem",
                              paddingTop: "0.5rem",
                            }}
                          >
                            Insufficient Liquidity
                          </p>
                        )} */}
                      </div>
                    </div>

                    {/* <button
                      className="relativ text-base leading-[24px] font-medium text-teal-600 -ml-2 md:ml-0 "
                      onClick={() => {
                        setUsdcValue(usdcBalance.toFixed(2));
                      }}
                    >
                      MAX
                    </button> */}
                    <img
                      className="self-stretch relativ max-h-full w-1px "
                      alt=""
                      src={hr}
                    />
                    <div className="block  text-left overflow-auto -mt-2 items-center ">
                      <select
                        name=""
                        id=""
                        className="bg-gray-50 text-xl md:px- text-left  md:pr-20"
                      >
                        {/* <option value=""></option> */}
                        <option className="" value="USDC">
                          USDC
                        </option>
                      </select>
                      <p className="text-xs md:text-left md:flex ml-1 block ">
                        Balance:
                        {usdcBalance ? (
                          <span className="flex overflow-scroll sm:px-1 px-0">
                            {parseFloat(
                              Number(usdcBalance).toFixed(2)
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        ) : (
                          "0.00"
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div className="self-stretch flex flex-col items-center justify-start">
                  <button onClick={toggleBuySell}>
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
                  <>
                    <div className="self-stretch rounded-2xl bg-gray-50 flex flex-row items-center justify-start py-2 md:px-5 px-2 gap-[20px] text-5xl border-[1px] border-solid ">
                      <img
                        className=" md:inline-block w-[40.11px] h-[40.11px]"
                        alt=""
                        src={logo}
                      />

                      <div className=" md:mr-28 text-xl block">
                        <input
                          className="md:w-[130px]  w-[84px] -ml-2 md:ml-0 bg-gray-50 pl-2"
                          placeholder="USDC"
                          type="number"
                          value={usdcValue}
                          onChange={handleUsdcValueChange}
                        ></input>
                      </div>
                      {/* <button
                        className="relativ text-base leading-[24px] font-medium text-teal-600 -ml-2 md:ml-0 "
                        onClick={() => {
                          setUsdcValue(usdcBalance.toFixed(2));
                        }}
                      >
                        MAX
                      </button> */}

                      <img
                        className="self-stretch relativ max-h-full w-1px "
                        alt=""
                        src={hr}
                      />

                      <div className="block  text-left overflow-auto -mt-2 ">
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
                          <span className="flex overflow-scroll lg:px-1">
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
                    {insufficientUSDC ? (
                      <h1
                        className="text-red-600 text-[16px]  mb-3  mt-1"
                        style={{
                          paddingLeft: "0.5rem",
                          paddingTop: "0.5rem",
                        }}
                      >
                        Insufficient USDC balance
                      </h1>
                    ) : (
                      ""
                    )}
                    {insufficientCG8 && (
                      <p
                        className="mb-2 text-red-600 "
                        style={{
                          paddingLeft: "0.5rem",
                        }}
                      >
                        Insufficient CG8 balance
                      </p>
                    )}
                    {/* {insufficientLiquidity ? (
                      <h1
                        className="text-red-600 text-[16px] -mt-4 mb-3"
                        style={{ paddingLeft: "0.5rem", paddingTop: "0.5rem" }}
                      >
                        Insufficient Liquidity
                      </h1>
                    ) : (
                      ""
                    )} */}
                  </>
                ) : (
                  <div className="self-stretch rounded-2xl bg-gray-50 flex flex-row items-center justify-start py-2 md:px-5 px-2 gap-[20px] text-5xl border-[1px] border-gray-200">
                    <img
                      className=" w-[40.11px] h-[40.11px]"
                      alt=""
                      src={CG8}
                    />
                    <div className="block md:mr-28  text-xl">
                      <input
                        className="md:w-[130px]  w-[84px] -ml-2 md:ml-0 bg-gray-50 pl-2"
                        placeholder="CG8"
                        type="number"
                        value={cg8Value}
                        onChange={handleCg8ValueChange}
                      ></input>
                    </div>
                    {/* <button
                      className="relativ text-base  font-medium text-teal-600 my-auto -ml-2 md:ml-0 "
                      onClick={async () => {
                        setCg8Value(cg8Balance.toFixed(2));
                        const r1: any = await getMinAmountOut(
                          cg8Balance.toString()
                        );
                        setUsdcValue(r1.toFixed(2));
                      }}
                    >
                      MAX
                    </button> */}
                    <img
                      className="self-stretch  max-h-full w-1px "
                      alt=""
                      src={hr}
                    />
                    <div className="block  text-left overflow-auto -mt-2">
                      <select
                        name=""
                        id=""
                        className="bg-gray-50 text-xl  md:pr-24   text-left "
                      >
                        {/* <option value=""></option> */}
                        <option value="CGate">CG8</option>
                      </select>
                      <p className="text-xs md:text-left  md:flex ml-1 md:ml-1 block  ">
                        Balance:&nbsp;
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

            <div className="md:flex text-sm font-light md:gap-60 my-3 ">
              <div className="text-left mt-8 md:mt-0">
                <p>1.00 CG8 = {parseFloat(cg8Price)?.toFixed(2)} USDC</p>
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
                    {isCg8Buy ? (
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
                    ) : (
                      <button
                        className="self-stretch rounded-3xl flex flex-row items-center justify-center text-sm text-white"
                        onClick={approve}
                      >
                        <div className="flex-1 rounded-3xl bg-teal-600 flex flex-row items-center justify-center p-4 gap-[8px]">
                          <div className="relative leading-[15px]  ">
                            Approve CG8
                          </div>
                        </div>
                      </button>
                    )}
                  </>
                )}
              </>
            ) : (
              <ConnectButton></ConnectButton>
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
