/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { getWithdrawHistory } from "../../utils/apiServices";
import { useEffect, useState, useContext } from "react";
import { useAccount } from "wagmi";
import { appContext } from "../../context/context.jsx";

interface WithdrawalHistoryProps {
  setOpenWithdrawHistory: (value: boolean) => void;
}

type WithdrawalType = {
  amount: string;
  amount2: string;
  datetime: string;
  maturitydatetime: string;
};

const ITEMS_PER_PAGE = 3;

const WithdrawalHistory = ({
  setOpenWithdrawHistory,
}: WithdrawalHistoryProps) => {
  const { address } = useAccount();
  const [withdrawData, setWithdrawData] = useState<any[]>([]);
  const [cg8Price, setCg8Price] = useState<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const myContext = useContext<any>(appContext);

  useEffect(() => {
    const fetchWithdrawHistory = async () => {
      try {
        if (address) {
          const price = myContext?.trade?.outputAmount.toExact();
          setCg8Price(price);
          const data = await getWithdrawHistory(address);
          console.log("data of withdraw history is--->", data);
          setWithdrawData(data);
        }
      } catch (e) {
        console.log("error is--->", e);
      }
    };
    fetchWithdrawHistory();
  }, [address]);

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Amount,Withdraw Date/Time\n" +
      withdrawData
        ?.map((e) => `${e.withdrawAmount},${formatDate(e.withdrawDate)}`)
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Withdraw_history.csv");
    document.body.appendChild(link);
    link.click();
  };

  function formatDate(isoString: string) {
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
    return date.toLocaleString("en-US", options).replace(/,/g, " ");
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const paginatedData = withdrawData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-auto md:w-[700px] w-full max-w-[700px] p-6">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">My withdrawal history</h2>
          <button
            onClick={() => setOpenWithdrawHistory(false)}
            className="text-gray-600 hover:text-gray-800"
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
          </button>
        </div>
        <div className="p-4">
          <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="font-medium p-3 text-left">Amount</th>
                  <th className="font-medium p-3 text-left">
                    Withdraw Date/Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((entry, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3 text-[16px]">
                      <span className="inline-block whitespace-nowrap">
                        {entry.withdrawAmount.toFixed(2)} CG8
                      </span>
                      <p className="text-xs text-gray-600">
                        ~${(entry.withdrawAmount * cg8Price).toFixed(2)}
                      </p>
                    </td>
                    <td className="p-3 text-sm">
                      {formatDate(entry.withdrawDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`bg-gray-300 text-gray-700 font-light text-sm py-2 px-4 rounded-3xl ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage * ITEMS_PER_PAGE >= withdrawData.length}
            className={`bg-gray-300 text-gray-700 font-light text-sm py-2 px-4 rounded-3xl ${
              currentPage * ITEMS_PER_PAGE >= withdrawData.length
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Next
          </button>
        </div>
        <button
          onClick={downloadCSV}
          className="bg-teal-600 hover:bg-blue-700 text-white font-light text-sm md:py-2 p-4 md:w-[224px] w-full py-4 rounded-3xl mt-5"
        >
          Download in CSV
        </button>
      </div>
    </div>
  );
};

export default WithdrawalHistory;
