/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getClaimHistory } from "../../utils/apiServices";
import {getAmountOut,getMinAmountIn } from "../../utils/web3Utils";
import { USDC_CONTRACT,TOKEN_CONTRACT } from "../../constants/contracts";
interface ClaimHistoryProps {
  setOpenClaimHistory: (value: boolean) => void;
}

const ClaimHistory = ({ setOpenClaimHistory }: ClaimHistoryProps) => {
  const { address } = useAccount();
  const [claimData, setClaimData] = useState<any>();
  const [cg8Price, setCg8Price] = useState<any>();

  useEffect(() => {
    const fetchClaimtHistory = async () => {
      try {
        if (address) {
           let price: any = await getMinAmountIn("1");
           price = parseFloat(price).toFixed(2);
           setCg8Price(price);
          const data = await getClaimHistory(address);
          console.log("data of claim history is--->", data);
          setClaimData(data);
        }
      } catch (e) {
        console.log("error is--->", e);
      }
    };
    fetchClaimtHistory();
  }, [address]);
  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Amount,Date/Time\n" +
      claimData?.map((e) => `${e?.claimAmount},${e?.datetime}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "claim_history.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md lg:w-[570px]  py-8 ml-2 w-[380px]">
      <div className="flex justify-between items-center  ">
        <h1 className="text-lg">My claim history</h1>
        <span
          className="cursor-pointer text-2xl"
          onClick={() => {
            setOpenClaimHistory(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M17 1L1 17"
              stroke="#475568"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 1L17 17"
              stroke="#475568"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <div className=" gap-4 mt-5 lg:pr-10 pr-9 pl-5 lg:w-[500px] w-full">
        <div className="md:flex justify-between bg-[#F5F6FE] p-3 lg:pr-24  rounded-3xl lg:w-[500px] w-[99%] hidden">
          <div className="font-medium">Amount</div>
          <div className="font-medium">Claim date/time</div>
        </div>
        <div className="">
          {claimData?.map((entry, idx) => (
            <>
              <div className="md:flex justify-between py-5 mr-9 text-[16px] leading-6">
                <div
                  key={idx + "amount"}
                  className="md:block flex text-[16px] font-semibold leading-6"
                >
                  {entry?.claimAmount.toFixed(2)}
                  {" CG8"}
                  <p className="md:text-xs text-[16px] font-semibold">
                    ~({(entry?.claimAmount * cg8Price).toFixed(2)}) {" USDC"}
                  </p>
                </div>

                <div key={idx + "date"} className="block">
                  {entry?.claimDate}
                </div>
              </div>
              <hr />
            </>
          ))}
        </div>
      </div>
      <button
        onClick={downloadCSV}
        className="bg-teal-600 hover:bg-blue-700 text-white font-light text-sm md:py-2 md:w-[224px] px-4 rounded-3xl mt-5 w-full py-4"
      >
        Download in CSV
      </button>
    </div>
  );
};

export default ClaimHistory;
