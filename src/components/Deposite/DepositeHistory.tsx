/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAccount } from "wagmi";
import { useEffect, useState, useContext } from "react";
import { getDepositHistory } from "../../utils/apiServices";
import {
  getMinAmountOut,
  getAmountOut,
  getMinAmountIn,
} from "../../utils/web3Utils";
import { USDC_CONTRACT, TOKEN_CONTRACT } from "../../constants/contracts";
import { appContext } from "../../context/context.jsx";
interface DepositeHistoryProps {
  setOpenDepositeHistory: (value: boolean) => void;
}

type DepositeType = {
  amount: string;
  amount2: string;
  datetime: string;
  maturitydatetime: string;
};

const DepositeHistory = ({ setOpenDepositeHistory }: DepositeHistoryProps) => {
  const myContext = useContext<any>(appContext);
  const { address, isConnected } = useAccount();
  const [depositData, setDepositData] = useState<any>();
  const [cg8Price, setCg8Price] = useState<any>();

  useEffect(() => {
    const fetchDepositHistory = async () => {
      try {
        if (address) {
          const price = myContext?.trade?.outputAmount.toExact();
          
          setCg8Price(price);
          const data = await getDepositHistory(address);
          console.log("data of deposit history is--->", data);
          setDepositData(data);
        }
      } catch (e) {
        console.log("error is--->", e);
      }
    };
    fetchDepositHistory();
  }, [address]);

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Amount,Date/Time\n" +
      depositData?.map((e) => `${e.depositAmount},${e.depositDat}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Deposite_history.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="bg-white md:p-5 rounded-lg shadow-md md:w-[700px] w-[390px] py-8 md:px-8 p-4 ">
      <div className="flex justify-between items-center px-4 ">
        <h1 className="text-lg">My Deposit history</h1>
        <span
          className="cursor-pointer text-2xl"
          onClick={() => {
            setOpenDepositeHistory(false);
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
      <div className=" gap-4 mt-5 pr-10 pl-5 ">
        <div className="md:flex justify-between bg-[#F5F6FE] p-3 px-5  rounded-3xl md:w-[600px] hidden">
          <div className="font-medium mr-6">Amount</div>
          <div className="font-medium">Deposited on date/time</div>
          <div className="font-medium">Maturity on date/time</div>
        </div>
        <div className="">
          {depositData?.map((entry, idx) => (
            <>
              <div className="md:flex justify-between py-5 px-3 ">
                <div
                  key={idx + "amount"}
                  className="md:block flex text-[16px] font-semibold"
                >
                  <span className="md:hidden mr-1">Amount: </span>{" "}
                  {entry.depositAmount}
                  {" CG8"}
                  <p className="md:text-xs ">
                    ~({(entry.depositAmount * cg8Price).toFixed(5)}) {" USDC"}
                  </p>
                </div>

                <div key={idx + "date"} className="block text-sm ">
                  <span className="text-sm md:hidden">Deposited on: </span>{" "}
                  {entry.depositDate}
                </div>

                <div key={idx + "maturitydate"} className="block text-sm">
                  <span className="text-sm md:hidden">Maturity on: </span>{" "}
                  {entry.maturitydatetime}
                </div>
              </div>
              <hr />
            </>
          ))}
        </div>
      </div>
      <button
        onClick={downloadCSV}
        className="bg-teal-600 hover:bg-blue-700 text-white font-light text-sm md:py-2 p-4 md:w-[224px] w-full py-4 rounded-3xl mt-5"
      >
        Download in CSV
      </button>
    </div>
  );
};

export default DepositeHistory;
