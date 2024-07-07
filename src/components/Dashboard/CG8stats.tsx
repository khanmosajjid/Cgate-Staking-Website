/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from "react";
import X from "./assets/X.svg";
import arrow from "./assets/arrow-up-line.svg";
import graph from "./assets/Line Graph.png";
import { getAmountOut, totalTokenSupply } from "../../utils/web3Utils";
import { TOKEN_CONTRACT, USDC_CONTRACT } from "../../constants/contracts";
import { appContext } from "../../context/context.jsx";

interface HistoryCardProp {
  setOpenCG8Details: (value: boolean) => void;
  setSetting: (value: boolean) => void;
}

const CG8stats = ({ setOpenCG8Details, setSetting }: HistoryCardProp) => {
  const [state, setState] = useState(true);
  const [cg8Price, setCg8Price] = useState<any>();
  const [hours, setHours] = useState(true);
  const [week, setWeek] = useState(false);
  const [month, setMonth] = useState(false);
  const [year, setYear] = useState(false);
  const [marketCap, setMarketCap] = useState();
  const myContext = useContext<any>(appContext);

  useEffect(() => {
    const getCG8Balance = async () => {
      const price: any = myContext?.trade?.outputAmount.toExact();

      setCg8Price(price);
      const totalSupply: any = await totalTokenSupply();
      const marketCap = totalSupply * price;
      console.log("market cap is---->>", marketCap);
    };
    getCG8Balance();
  }, []);

  return (
    <div className="absolute md:top-[100px]  top-[180px] md:left-[calc(50%_-_300px)] mx-auto rounded-xl border bg-[#F5F6FE] shadow-lg lg:w-[600px] w-[95%] ml-3 flex flex-col items-center justify-start md:p-8 p-3 box-border gap-[24px] text-basic-black">
      <div className="self-stretch flex flex-row items-center justify-start">
        <div className="flex-1 flex flex-row items-center justify-end gap-[10px]">
          <div className="flex-1 relative leading-[24px] font-medium">
            CG8 stats
          </div>
          <button
            onClick={() => {
              setOpenCG8Details(false);
              setSetting(false);
            }}
          >
            <img className="relative w-[18px] h-[18px]" alt="" src={X} />
          </button>
        </div>
      </div>

      <div className="lg:w-[536px] w-full mx-auto flex flex-col items-start justify-center text-xs  text-white ">
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
      </div>

      <div className="flex flex-col  justify-start p-2 gap-[3px]  bg-[#F5F6FE]  text-colors-neutral-800 font-light w-[98%]">
        <div className="self-stretch flex flex-row py-1 px-0 justify-between ">
          <div className="flex-1 relative   inline-block h-[25px] mix-blend-normal">
            CG8 price
          </div>
          <div className="flex flex-row  justify-start gap-[5px] text-right text-sub-heading">
            <div className="relative  ">${parseFloat(cg8Price).toFixed(2)}</div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
          <div className="flex-1 relative inline-block h-[25px] ">
            Market cap
          </div>
          <div className="flex flex-row items-start justify-start text-right">
            <div className="relative  ">$ 1.09M</div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
          <div className="flex-1 relative inline-block h-[25px] mix-blend-normal">
            Token holders
          </div>
          <div className="flex flex-row items-start justify-start text-right text-sub-heading">
            <div className="relative leading-[24px] ">5,621</div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
          <div className="flex-1 relative inline-block h-[25px] mix-blend-normal">
            Monthly CG8 Trade volume
          </div>
          <div className="flex flex-row items-start justify-start text-right text-sub-heading">
            <div className="relative">
              <p className="m-0 ">8.1M</p>
              <p className="m-0 text-xs  text-neutral-600">~$ 8.1M</p>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
          <div className="flex-1 relative leading-[24px] mix-blend-normal">
            Highest staking APR
          </div>
          <div className="w-6 flex flex-row items-start justify-start text-right text-sub-heading">
            <div className="flex-1 relative leading-[24px]">5%</div>
          </div>
        </div>
        {/* <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
            <div className="flex-1 relative  inline-block h-[25px] mix-blend-normal">
              <span>{`Sales tax `}</span>
              <span className=" text-teal-600  ">(?)</span>
            </div>
            <div className="flex flex-row items-start justify-start text-right text-sub-heading">
              <div className="relative leading-[24px] ">0%-50%</div>
            </div>
          </div> */}
        <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
          <div className="flex-1 relative leading-[24px]  inline-block h-[25px] mix-blend-normal">
            Total deposits
          </div>
          <div className="flex flex-row items-start justify-start text-right text-sub-heading">
            <div className="relative leading-[24px]">
              <p className="m-0">
                <span>
                  <span className="">5.325.121 CG8</span>
                </span>
              </p>
              <p className="m-0 text-xs text-slategray">
                <span>
                  <span className="font-body-b1-regular">{` `}</span>
                </span>
                <span className="">~$5.325.121</span>
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
              <p className="m-0 ">1.00 USDC</p>
              <p className="m-0 text-xs  text-slategray">~$ 1.00</p>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-center justify-start py-1 px-0 gap-[24px]">
          <div className="flex-1 relative leading-[24px]  inline-block h-[25px] mix-blend-normal">
            Max CG8 trans. size
          </div>
          <div className="flex flex-row items-start justify-start text-right text-sub-heading">
            <div className="relative leading-[24px] ">10,000 CG8</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CG8stats;
