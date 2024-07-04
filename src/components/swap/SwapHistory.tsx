/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { getSwapHistory } from "../../utils/apiServices";
import { useAccount } from "wagmi";
interface swapHistoryProps {
  setOpenHistory: (value: boolean) => void;
  setSetting: (value: boolean) => void;
}

const SwapHistory = ({ setOpenHistory, setSetting }: swapHistoryProps) => {
  const [swaps, setSwaps] = useState<any>();
  const { address } = useAccount();
  useEffect(() => {
    const getHistory = async () => {
      const res = await getSwapHistory(address);
      console.log("res of swap history is ----->", res);
      setSwaps(res);
    };
    getHistory();
  }, []);
  
 function formatDate(isoString) {
   const date = new Date(isoString);

   const options:any = {
     year: "numeric",
     month: "long",
     day: "numeric",
     hour: "2-digit",
     minute: "2-digit",
     second: "2-digit",
     timeZoneName: "short",
   };

   return date.toLocaleString("en-US", options);
 }
 
  return (
    <div className="bg-white  mt-10 ml-5  w-[90%] mx-auto p-6 rounded-xl shadow-md  absolute lg:left-[400px] lg:top-[100px] top-[100px] lg:w-[49%] md:mx-auto  border ">
      <div className="text-xl font-md mb-4">My swap history</div>
      <button
        className="absolute top-2 right-2 p-2 rounded-full text-2xl font-light hover:bg-gray-200"
        onClick={() => {
          setOpenHistory(false);
          setSetting(false);
        }}
      >
        <span className="sr-only">Close</span>×
      </button>

      <div className="md:grid md:grid-cols-4 gap-10 text-gray-600  border-b pb-2 mb-4 bg-blue-50 p-2 rounded-3xl hidden">
        <span>Wallet</span>
        <span>Type</span>
        <span>Amount</span>
        <span>Date/time</span>
      </div>

      {swaps?.map((swap, index) => (
        <div className="">
          <div
            key={index}
            className="md:grid md:grid-cols-4 gap-5 text-gray-800 border-b py-2.5 font-light hidden "
          >
            <span>
              {swap?.walletAddress.slice(0, 5) +
                "..." +
                swap?.walletAddress.slice(-5)}
            </span>
            <span>USDC-CG8</span>
            <div className="block">
              <span className="block">{swap?.outAmount.toFixed(2)}</span>
              {/* <span className="text-xs">~${(swap?.inAmount)?.toFixed(2)}</span> */}
            </div>
            <span>{formatDate(swap?.dateTime)}</span>
          </div>
        </div>
      ))}

      <button
        className="mt-4 bg-teal-600 hover:bg-blue-600 text-white py-3 px-4  lg:w-1/3 w-full rounded-3xl text-sm"
        onClick={() => {
          setOpenHistory(false);
          setSetting(false);
        }}
      >
        Download in CSV
      </button>
    </div>
  );
};

export default SwapHistory;
