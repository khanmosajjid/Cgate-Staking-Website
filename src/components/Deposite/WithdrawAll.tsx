/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import {
  totalStakeCountPerPool,
  withdraw,
  getUserAllStakesForPool,
  convertToEther,
  convertEpochToLocalTime,
  daysBetweenEpochAndNow,
  getPoolDetailsWithPoolId,
  withdrawPerStake,
  getMinAmountOut,
  getAmountOut,
  getMinAmountIn,
} from "../../utils/web3Utils";
import { TOKEN_CONTRACT, USDC_CONTRACT } from "../../constants/contracts";
import { ThreeCircles } from "react-loader-spinner";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { appContext } from "../../context/context.jsx";
import { addWithdrawHistory } from "../../utils/apiServices.js";
interface DepositCardProps {
  setOpenWithdrawCG8: (value: boolean) => void;
  poolId: string;
  poolTime: string;
}
let loader = false;
const WithdrawItem = ({
  amount,
  date,
  isAllowed,
  poolId,
  stakeId,
  setOpenWithdrawCG8,
  price
}) => {
   const { address, isConnected } = useAccount();
  const navigate = useNavigate();
 
  console.log("is allowd is----->", isAllowed);
 
  return (
    <>
      {amount > 0 ? (
        <div className="md:flex justify-between items-center py-2 border-b border-gray-200 ">
          <div className="flex md:block">
            <p className="md:text-sm text-lg text-gray-700 font-semibold md:font-normal">
              <span className="md:hidden">Amount: </span>{" "}
              {parseFloat(amount).toFixed(2)} CG8
            </p>
            <p className="md:text-xs text-lg md:text-gray-500">
              ~$
              {parseFloat((amount * price).toFixed(2)).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>
          </div>
          <div>
            <p className="md:font-light text-[15px] text-gray-900">
              <span className="md:hidden ">Deposited on: </span>
              {date}
            </p>
          </div>

          {isAllowed ? (
            <button
              className="mt-1 md:mt-0 bg-teal-600 hover:bg-teal-700 text-white text-[12px] py-1.5 px-5 rounded-2xl"
              onClick={async () => {
                let res = await withdrawPerStake(poolId, amount, stakeId);
                
                console.log("res is----->", res);

                if (res.status == "success") {
                  let withdraw = await addWithdrawHistory(
                    address,
                    amount,
                    poolId,
                    res?.transactionHash
                  );
                  console.log("withdrw result is---->", withdraw);
                  setOpenWithdrawCG8(false);
                  
                }
                // window.location.reload();
                // navigate("/deposit");
              }}
            >
              Withdraw
            </button>
          ) : (
            <button
              disabled
              className="mt-1 md:mt-0 bg-white text-gray-600 hover:bg-teal-700  text-[12px] py-1.5 px-5 rounded-2xl"
            >
              Withdraw
            </button>
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const WithdrawModal = ({
  transactions,
  total,
  currency,
  setOpenWithdrawCG8,
  poolId,
  price
}) => {
  const { address, isConnected } = useAccount();
 
 
 
  return (
    <>
      <div className="fixed inset-0  bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center ">
        <div className="bg-[#F5F6FE] rounded-lg max-w-lg w-full mx-4 md:p-3">
          <div className="py-7 px-6 justify-between flex border-b md:border-none  border-gray-200">
            <h3 className=" font-normal text-[16px]">Withdraw {currency}</h3>
            <button onClick={() => setOpenWithdrawCG8(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
              >
                <path
                  d="M17 1.5L1 17.5"
                  stroke="#475568"
                  strokeWidth="2"
                  stroke-linecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 1.5L17 17.5"
                  stroke="#475568"
                  strokeWidth="2"
                  stroke-linecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="hidden md:flex gap-20 bg-white p-2 pl-2 w-[95%] mx-auto rounded-xl text-sm">
            <p>Amount </p>
            <p>Deposited on date/time</p>
          </div>
          {loader ? (
            <div className="flex justify-center items-center">
              <ThreeCircles
                height="100"
                width="100"
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="three-circles-rotating"
                outerCircleColor=""
                innerCircleColor=""
                middleCircleColor=""
              />
            </div>
          ) : (
            <>
              <div className="p-6">
                <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
                  {console.log("transsaction is----->", transactions)}
                  {transactions.map((transaction, index) => (
                    <WithdrawItem
                      key={index}
                      amount={convertToEther(transaction[0])}
                      date={convertEpochToLocalTime(Number(transaction[3]))}
                      // days={daysBetweenEpochAndNow(Number(transaction[3]))}
                      isAllowed={transaction[6]}
                      poolId={poolId}
                      stakeId={index}
                      setOpenWithdrawCG8={setOpenWithdrawCG8}
                      price={price}
                    />
                  ))}
                </div>
                <div className="mt-4 pt-2 md:flex justify-between border-gray-200">
                  <div>
                    <span className="md:text-sm text-base font-semibold md:font-normal  text-gray-900 ">
                      Total available to withdraw:
                    </span>
                  </div>
                  <div className="flex md:block my-2 md:text-gray-900 font-light md:font-normal text-right">
                    <span className="md:text-sm text-[14px] md:block">{`${total.toFixed(
                      2
                    )} CG8 `}</span>
                    <span className="md:text-xs text-[12px] text-gray-600">
                      <span className="md:hidden"> (</span>
                      ~$
                      {parseFloat((total * price).toFixed(2)).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                      <span className="md:hidden">)</span>
                    </span>
                  </div>
                  <div>
                    <button
                      className="w-full  bg-teal-600 hover:bg-teal-600 text-white py-2 px-3  rounded-2xl md:text-xs"
                      onClick={async () => {
                        let res=await withdraw(poolId);
                        // console.log("result of withdraw is---->",res);
                        if (res.status == "success") {
                          // let data = {
                          //   walletAddress: address,
                          //   withdrawAmount: total,
                          //   poolId: poolId,
                          //   transactionHash: res?.transactionHash,
                          // };
                          let withdraw = await addWithdrawHistory(
                            address,
                            total,
                            poolId,
                            res?.transactionHash
                          );
                          console.log("withdraw all result is", withdraw);
                        }
                      }}
                    >
                      Withdraw all
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Corrected WithdrawAll component
const WithdrawAll = ({
  setOpenWithdrawCG8,
  poolId,
  poolTime,
}: DepositCardProps) => {
  console.log(poolTime);
  const { address, isConnected } = useAccount();
  const [stakeCount, setStakeCount] = useState(0);
  const [userStakes, setUserStakes] = useState([]);
  const [totalAmountToWithdraw, setTotalAmountToWithdraw] = useState(0);
    const [cg8Price, setCg8Price] = useState<any>();
  const myContext = useContext<any>(appContext);
  useEffect(() => {
    const getPoolDetails = async () => {
      const price = myContext?.trade?.outputAmount.toExact();
      setCg8Price(price)
      console.log("price of cgd in withdraw all is", price);
      loader = true;
      const poolDetails = await getPoolDetailsWithPoolId(address, poolId);
      console.log("pool details is----->", poolDetails);

      let stakeTime = Number(poolDetails[0][0]) / (24 * 60 * 60);

      const count = await totalStakeCountPerPool(address, poolId);

      if (count) {
        setStakeCount(Number(count));
      }
      let stakeData = [];
      let amount: number = 0;

      for (let i = 0; i < Number(count); i++) {
        const data: any = await getUserAllStakesForPool(address, poolId, i);
        console.log("data is again---->", data);
        let time = daysBetweenEpochAndNow(Number(data[3]));

        if (time >= stakeTime) {
          amount = amount + parseFloat(convertToEther(data[0]).toString());

          data.push(true);
        } else {
          data.push(false);
        }

        stakeData.push(data);
      }
      loader = false;

      setTotalAmountToWithdraw(amount);
      setUserStakes(stakeData);
    };
    getPoolDetails();
  }, []);

  return (
    <>
      <WithdrawModal
        transactions={userStakes}
        total={totalAmountToWithdraw}
        currency="CG8"
        setOpenWithdrawCG8={setOpenWithdrawCG8} // Pass the function to the modal
        poolId={poolId}
        price={cg8Price}
      />
    </>
  );
};

export default WithdrawAll;
