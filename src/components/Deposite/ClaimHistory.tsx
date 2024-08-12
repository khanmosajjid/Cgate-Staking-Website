/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getClaimHistory } from "../../utils/apiServices";
import { getAmountOut, getMinAmountIn } from "../../utils/web3Utils";

interface ClaimHistoryProps {
  setOpenClaimHistory: (value: boolean) => void;
}

const ITEMS_PER_PAGE = 3; // Number of items to show per page

const ClaimHistory = ({ setOpenClaimHistory }: ClaimHistoryProps) => {
  const { address } = useAccount();
  const [claimData, setClaimData] = useState<any[]>([]);
  const [cg8Price, setCg8Price] = useState<any>();
  const [currentPage, setCurrentPage] = useState<number>(1); // State for current page

  useEffect(() => {
    const fetchClaimHistory = async () => {
      try {
        if (address) {
          let price: any = await getMinAmountIn("1");
          price = parseFloat(price).toFixed(2);
          setCg8Price(price);
          let data = await getClaimHistory(address);

          // Sort the claim data by date in descending order
          data = data.sort(
            (a: any, b: any) =>
              new Date(b.claimDate).getTime() - new Date(a.claimDate).getTime()
          );

          setClaimData(data);
        }
      } catch (e) {
        console.log("error is--->", e);
      }
    };
    fetchClaimHistory();
  }, [address]);

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Amount,Date/Time\n" +
      claimData
        ?.map((e) => `${e?.claimAmount},${formatDate(e?.claimDate)}`)
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "claim_history.csv");
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

  // Handle pagination
  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  // Calculate the paginated data
  const paginatedData = claimData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white p-5 rounded-lg shadow-md lg:w-[570px] py-8 ml-2 w-[380px]">
      <div className="flex justify-between items-center">
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
      <div className="mt-5 lg:pr-10 pr-9 pl-5 lg:w-[500px] w-full">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-[#F5F6FE] font-medium text-left">
                Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-[#F5F6FE] font-medium text-left">
                Claim date/time
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((entry, idx) => (
              <tr key={idx} className="text-left">
                <td className="py-2 px-4 border-b border-gray-200 text-left">
                  {entry?.claimAmount.toFixed(2)} USDC
                  <div className="text-xs text-gray-500">
                    ~$
                    {entry?.claimAmount.toFixed(2)}
                  </div>
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-left">
                  {formatDate(entry?.claimDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
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
          disabled={currentPage * ITEMS_PER_PAGE >= claimData.length}
          className={`bg-gray-300 text-gray-700 font-light text-sm py-2 px-4 rounded-3xl ${
            currentPage * ITEMS_PER_PAGE >= claimData.length
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Next
        </button>
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
