/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAccount } from "wagmi";
import { useEffect, useState, useContext } from "react";
import { getDepositHistory } from "../../utils/apiServices";
import { appContext } from "../../context/context.jsx";

interface DepositeHistoryProps {
  setOpenDepositeHistory: (value: boolean) => void;
}



const ITEMS_PER_PAGE = 3;

const DepositeHistory = ({ setOpenDepositeHistory }: DepositeHistoryProps) => {
  const myContext = useContext<any>(appContext);
  const { address, isConnected } = useAccount();
  const [depositData, setDepositData] = useState<any[]>([]);
  const [cg8Price, setCg8Price] = useState<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchDepositHistory = async () => {
      try {
        if (address) {
          const price = myContext?.trade?.outputAmount.toExact();
          setCg8Price(price);
          let data = await getDepositHistory(address);
          console.log("data of deposit history is--->", data);

          // Sort the deposit data by date in descending order
          data = data.sort(
            (a: any, b: any) =>
              new Date(b.depositDate).getTime() -
              new Date(a.depositDate).getTime()
          );

          setDepositData(data);
        }
      } catch (e) {
        console.log("error is--->", e);
      }
    };
    fetchDepositHistory();
  }, [address]);

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

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Amount,Deposit Date/Time ,Maturity Date/Time\n" +
      depositData
        ?.map(
          (e) =>
            `${e.depositAmount},${formatDate(e.depositDate)},${formatDate(
              e.maturityDate
            )}`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Deposite_history.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const paginatedData = depositData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white md:p-5 rounded-lg shadow-md md:w-[700px] w-[390px] py-8 md:px-8 p-4 ">
      <div className="flex justify-between items-center px-4 ">
        <h1 className="text-lg">My deposit history</h1>
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
              {paginatedData.map((entry, idx) => (
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
          disabled={currentPage * ITEMS_PER_PAGE >= depositData.length}
          className={`bg-gray-300 text-gray-700 font-light text-sm py-2 px-4 rounded-3xl ${
            currentPage * ITEMS_PER_PAGE >= depositData.length
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
  );
};

export default DepositeHistory;
