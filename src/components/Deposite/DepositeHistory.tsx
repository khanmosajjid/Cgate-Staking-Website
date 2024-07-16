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

  function formatDate(isoString) {
    const date = new Date(isoString);

    const options: any = {
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
      <div className="gap-4 mt-5 pr-10 pl-5">
        <div className="bg-[#F5F6FE] p-3 px-5 rounded-3xl md:w-[600px]">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#F5F6FE]">
                <th className="font-medium p-3 text-left">Amount</th>
                <th className="font-medium p-3 text-left">
                  Deposited on date/time
                </th>
                <th className="font-medium p-3 text-left">
                  Maturity on date/time
                </th>
              </tr>
            </thead>
            <tbody>
              {depositData?.map((entry, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3 text-[16px]">
                    <span className="inline-block whitespace-nowrap">
                      {entry.depositAmount.toFixed(2)} CG8
                    </span>

                    <p className="text-xs text-gray-600">
                      ~${(entry.depositAmount * cg8Price).toFixed(2)}
                    </p>
                  </td>
                  <td className="p-3 text-sm">
                    {formatDate(entry.depositDate)}
                  </td>
                  <td className="p-3 text-sm">
                    {formatDate(entry.maturityDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
