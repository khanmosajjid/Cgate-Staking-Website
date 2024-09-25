/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import X from "../../assets/X.svg";

const exporerURL = "https://bscscan.com/tx/";

interface SuccessCardProps {
  transactionID?: any;
  setTransaction: (value: boolean) => void;
  msg: string;
  svg: any;
  btntext: string;
  para?: string;
}

const SuccessCard: React.FC<SuccessCardProps> = ({
  transactionID,
  setTransaction,
  msg,
  svg,
  btntext,
  para,
}) => {
  console.log("transaction id is-----.....", transactionID,setTransaction);
  return (
    <div className="bg-white p-6 lg:w-[400px] w-[390px] rounded-xl shadow-lg border  border-green-300 md:ml-[295px] mt-[130px]">
      <button
        className="ml-80"
        onClick={() => {
          setTransaction(false);
          window.location.reload();
        }}
      >
        <img src={X} alt="" />
      </button>
      <div className=" items-center justify-center mb-4 mx-auto ">
        <div className="w-[30%] mx-auto">{svg}</div>
        <div>
          <h2 className="text-xl font-normal text-center mt-4  ">{msg}</h2>
          <p className="text-xs text-center mt-4">{para}</p>
        </div>
      </div>
      {/* {transactionID && (
        <div className="text-gray-600 mb-6">
          Transaction ID: <span className="font-semibold">{transactionID}</span>
        </div>
      )} */}
      <hr />
      <br />
      <button
        className="w-full px-10 py-2 rounded-3xl bg-teal-600 text-white text-sm"
        onClick={async () => {
          const url = exporerURL + transactionID;
          window.open(url, "_blank");
        }}
      >
        {btntext}
      </button>
    </div>
  );
};

export default SuccessCard;
