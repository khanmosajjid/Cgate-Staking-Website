/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from "react";
import X from "./assets/X.svg";
import arrow from "./assets/arrow-up-line.svg";
import graph from "./assets/Line Graph.png";
import {
  userDetails,
  convertToEther,
  getMaxTransactionAmount,
  totalTokenSupply,
  getHighestAPR,
  addCommasToNumbers,
  getTotalHoldersCount
} from "../../utils/web3Utils";
import { TOKEN_CONTRACT, USDC_CONTRACT } from "../../constants/contracts";
import { appContext } from "../../context/context.jsx";
import { useAccount } from "wagmi";
import { getAllUserDetails } from "../../utils/apiServices.js";

interface HistoryCardProp {
  setopenHistoryPrice: (value: boolean) => void;
  setOpenCG8Details: (value: boolean) => void;
  setSetting: (value: boolean) => void;
  openCG8Details: boolean;
  // setOpenCG8Details:string;
}

const HistoricalPrice = ({
  setopenHistoryPrice,
  setOpenCG8Details,
  setSetting,
  openCG8Details,
}: HistoryCardProp) => {
  const [state, setState] = useState(true);
  const [cg8Price, setCg8Price] = useState<any>();
  const [hours, setHours] = useState(true);
  const [week, setWeek] = useState(false);
  const [month, setMonth] = useState(false);
  const [year, setYear] = useState(false);
  const [marketCap, setMarketCap] = useState(0);
  const myContext = useContext<any>(appContext);
  const { isConnected, address } = useAccount();
  const [totalDeposit, setTotalDeposit] = useState<any>();
  const [maxTransactionAmount, setMaxTransactionAmount] = useState<any>();
  const [holdersCount, setHoldersCount] = useState(null);
  const [highestAPR, setHighestAPR] = useState(null);
  const [poolReward,setPoolReward]=useState(null);

  useEffect(() => {
    const getCG8Balance = async () => {
      const price: any = myContext?.trade?.outputAmount.toExact();

      setCg8Price(price);
      const user: any = await userDetails(address);
      const res: any = convertToEther(Number(user[1]));
      
      const maxAmount = await getMaxTransactionAmount();
      setMaxTransactionAmount(maxAmount);

      const totalSupply: any = await totalTokenSupply();
      const marketCaps = totalSupply * price;

      setMarketCap(marketCaps);
      let count = await getTotalHoldersCount();
      count =parseInt(count.toString())+15;
      setHoldersCount(count);
      const poolDetails = await getHighestAPR();
      console.log("pool details is----->", poolDetails);
      setHighestAPR(poolDetails[0]);
      setTotalDeposit(poolDetails[1]);
      const userdetails=await getAllUserDetails();
     let amnt:any=0;
      for (let i = 0; i < userdetails.length; i++) {
        const user=await userDetails(userdetails[i].walletAddress)
          amnt += Number(user[2]);
     
           console.log("amnt for user i is", i, "---->", amnt);

        
      }
    
      
      
      
      setPoolReward(parseFloat(convertToEther(amnt).toString()).toFixed(2));
    };
    getCG8Balance();
  }, [address]);

  return (
    <div className="absolute md:top-[100px]  top-[180px] md:left-[calc(50%_-_300px)] mx-auto rounded-xl border bg-[#F5F6FE] shadow-lg lg:w-[600px] w-[95%] ml-3 flex flex-col items-center justify-start md:p-8 p-3 box-border gap-[24px] text-basic-black">
      <div className="self-stretch flex flex-row items-center justify-start">
        <div className="flex-1 flex flex-row items-center justify-end gap-[10px]">
          <div className="flex-1 relative leading-[24px] font-medium">
            CG8 stats
          </div>
          <button
            onClick={() => {
              setopenHistoryPrice(false);
              setSetting(false);
            }}
          >
            <img className="relative w-[18px] h-[18px]" alt="" src={X} />
          </button>
        </div>
      </div>

      <div className="lg:w-[536px] w-full mx-auto flex flex-col items-start justify-center text-xs  text-white ">
        {openCG8Details ? (
          <div className="self-stretch flex flex-row items-start justify-start rounded-2xl  border border-teal-600">
            <div className="flex-1 rounded-xl lg:h-9 flex flex-row items-start justify-start  ">
              <div
                className={`${
                  !state ? "bg-teal-600 text-white" : "bg-white text-teal-600"
                } flex-1  rounded-l-2xl flex flex-row items-center justify-center py-2.5 px-4 gap-[8px]`}
              >
                <button
                  className="relative leading-[16px] font-light "
                  onClick={() => {
                    setOpenCG8Details(false);
                  }}
                >
                  Historical price
                </button>
              </div>
            </div>
            <div className="flex-1 rounded-xl lg:h-9 flex flex-row items-start justify-start ml-[-1px] text-colors-teal-600">
              <div
                className={`${
                  state ? "bg-teal-600 text-white" : "bg-white text-teal-600"
                } flex-1 rounded-r-2xl flex flex-row items-center justify-center py-2.5 px-4 gap-[8px] `}
              >
                <button className={` relative leading-[16px] font-light `}>
                  Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="self-stretch flex flex-row items-start justify-start rounded-2xl  border border-teal-600">
            <div className="flex-1 rounded-xl lg:h-9 flex flex-row items-start justify-start  ">
              <div
                className={`${
                  state ? "bg-teal-600 text-white" : "bg-white text-teal-600"
                } flex-1  rounded-l-2xl flex flex-row items-center justify-center py-2.5 px-4 gap-[8px]`}
              >
                <button
                  className="relative leading-[16px] font-light "
                  onClick={() => {
                    setState(true);
                  }}
                >
                  Historical price
                </button>
              </div>
            </div>
            <div className="flex-1 rounded-xl lg:h-9 flex flex-row items-start justify-start ml-[-1px] text-colors-teal-600">
              <div
                className={`${
                  !state ? "bg-teal-600 text-white" : "bg-white text-teal-600"
                } flex-1 rounded-r-2xl flex flex-row items-center justify-center py-2.5 px-4 gap-[8px] `}
              >
                <button
                  className={` relative leading-[16px] font-light `}
                  onClick={() => {
                    setState(false);
                  }}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!openCG8Details && state ? (
        <div className="">
          <div className="self-stretch flex flex-col items-center justify-start gap-[6px] w-full mx-auto  ">
            <div className="self-stretch flex flex-col items-center justify-start text-5xl ">
              <div className="rounded-round-corner lg:w-[536px] w-full  flex flex-row items-center justify-start gap-[10px] p-4">
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
                <option value="CGate" className=" absolute top-80">
                  CG8
                </option>
                <div className="relative leading-[32px] md:font-lg  md:text-2xl  text-[20px]">
                  {parseFloat(cg8Price).toFixed(2)} USDC per CG8
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[536px] w-full  mx-auto flex flex-col items-start  justify-center text-xs text-colors-teal-600 border border-teal-600 rounded-2xl my-4 text-gray-700 ">
            <div className="self-stretch flex flex-row items-start justify-start ">
              <div className="flex-1 rounded-xl lg:h-9 flex  flex-row items-start justify-start text-white">
                <button
                  className={`${
                    hours ? "bg-teal-600 text-white" : "text-black"
                  } flex-1    flex flex-row items-center border-r border-teal-600 justify-center  py-2.5 px-4 gap-[px] rounded-l-xl`}
                  onClick={() => {
                    setHours(true);
                    setWeek(false);
                    setMonth(false);
                    setYear(false);
                  }}
                >
                  <div className="relative leading-[16px] flex font-medium">
                    Last 24 <span className="hidden md:block">hours</span>{" "}
                  </div>
                </button>
              </div>

              <div className="flex-1 rounded-round-buttons md:h-9 flex flex-row items-start justify-start ml-[-1px] ">
                <div
                  className={`${
                    week ? "bg-teal-600 text-white" : "text-black"
                  } flex-1 flex flex-row items-center justify-center py-2.5 px-4 gap-[8px] border-r-[1px] border-teal-600`}
                >
                  <button
                    className="relative leading-[16px] font-medium"
                    onClick={() => {
                      setHours(false);
                      setWeek(true);
                      setMonth(false);
                      setYear(false);
                    }}
                  >
                    1 Week
                  </button>
                </div>
              </div>

              <div className="flex-1 rounded-round-buttons md:h-9 flex flex-row items-start justify-start ml-[-1px]">
                <div
                  className={`${
                    month ? "bg-teal-600 text-white" : "text-black"
                  } flex-1 flex flex-row items-center justify-center py-2.5 px-4 gap-[8px] border-r  border-teal-600`}
                >
                  <button
                    className="relative leading-[16px] font-medium"
                    onClick={() => {
                      setHours(false);
                      setWeek(false);
                      setMonth(true);
                      setYear(false);
                    }}
                  >
                    1 Month
                  </button>
                </div>
              </div>

              <div className="flex-1 rounded-round-buttons md:h-9 flex flex-row items-start justify-start ml-[-1px]">
                <div
                  className={`${
                    year ? "bg-teal-600 text-white" : "text-black"
                  } flex-1 rounded-tl-none rounded-tr-981xl rounded-r-2xl rounded-bl-none flex flex-row items-center justify-center py-2.5 px-4 gap-[8px]   border-teal-600`}
                >
                  <button
                    className="relative leading-[16px] font-medium"
                    onClick={() => {
                      setHours(false);
                      setWeek(false);
                      setMonth(false);
                      setYear(true);
                    }}
                  >
                    1 Year
                  </button>
                </div>
              </div>
            </div>
          </div>
          <iframe
            id="dextools-widget"
            title="DEXTools Trading Chart"
            width="500"
            height="400"
            src="https://www.dextools.io/widget-chart/en/bnb/pe-light/0xde52250c41f1fc5ae1f50a51d1f367fb05c4f7dd?theme=light&chartType=2&chartResolution=30&drawingToolbars=false"
          ></iframe>
        </div>
      ) : (
        <div className="flex flex-col  justify-start p-2 gap-[3px]  bg-[#F5F6FE]  text-colors-neutral-800 font-light w-[98%]">
          <div className="self-stretch flex flex-row py-1 px-0 justify-between ">
            <div className="flex-1 relative   inline-block h-[25px] mix-blend-normal">
              CG8 price
            </div>
            <div className="flex flex-row  justify-start gap-[5px] text-right text-sub-heading">
              <div className="relative  ">
                ${parseFloat(cg8Price).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
            <div className="flex-1 relative inline-block h-[25px] ">
              Market cap
            </div>
            <div className="flex flex-row items-start justify-start text-right">
              <div className="relative  ">
                ${addCommasToNumbers(marketCap.toFixed(2))}
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
            <div className="flex-1 relative inline-block h-[25px] mix-blend-normal">
              Token holders
            </div>
            <div className="flex flex-row items-start justify-start text-right text-sub-heading">
              <div className="relative leading-[24px] ">{holdersCount}</div>
            </div>
          </div>

          <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
            <div className="flex-1 relative leading-[24px] mix-blend-normal">
              Highest staking APR
            </div>
            <div className="w-6 flex flex-row items-start justify-start text-right text-sub-heading">
              <div className="flex-1 relative leading-[24px]">
                {highestAPR}%
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
            <div className="flex-1 relative leading-[24px]  inline-block h-[25px] mix-blend-normal">
              Total deposits
            </div>
            <div className="flex flex-row items-start justify-start text-right text-sub-heading">
              <div className="relative leading-[24px]">
                <p className="m-0">
                  <span>
                    <span className="">{totalDeposit} CG8</span>
                  </span>
                </p>
                <p className="m-0 text-xs ">
                  <span></span>
                  <span className="">
                    ~${(totalDeposit * cg8Price)?.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
            <div className="flex-1 relative leading-[24px] inline-block h-[25px] mix-blend-normal">
              Total pool rewards
            </div>
            <div className="flex flex-row items-start justify-start text-right text-sub-heading">
              <div className="relative leading-[24px]">
                <p className="m-0 ">{poolReward} USDC</p>
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
            <div className="flex-1 relative leading-[24px]  inline-block h-[25px] mix-blend-normal">
              Max CG8 trans. size
            </div>
            <div className="flex flex-row items-start justify-start text-right text-sub-heading">
              <div className="relative leading-[24px] ">
                {maxTransactionAmount} CG8
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalPrice;
