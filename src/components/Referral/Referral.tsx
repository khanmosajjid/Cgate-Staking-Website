/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FunctionComponent, useState } from "react";
import { useRef, useEffect, useContext } from "react";
import Header from "../Header/Header";
import insta from "../../assets/insta.png";
import bg from "../../assets/Master-bg.svg";

import { fallback } from "viem";
import { useAccount } from "wagmi";
import { userDetails, convertToEther,getReferralsOfUser } from "../../utils/web3Utils";
import { useLocation } from "react-router-dom";



const ITEMS_PER_PAGE = 3;
const Referral: FunctionComponent = () => {
  const [openRefCard, setopenRefCard] = useState(false);
  const [openRefsetting, setopenRefsetting] = useState(false);
  const { address, isConnected } = useAccount();
  const [totalReferrer, setTotalReferrer] = useState<any>(0);
  const [referrerReward, setReferralReward] = useState<any>(0);
  const settingsRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const referralLink = `${window.location.origin}${window.location.pathname}?ref=${address}`;
  const query = new URLSearchParams(location.search);
  const refAddress = query.get("ref");
  console.log("ref address is--->", refAddress);

  const closeSettings = () => {
    setopenRefCard(false);
    setopenRefsetting(false);
  };
  useEffect(() => {
    (async () => {
      if (refAddress) {
        localStorage.setItem("refAddress", refAddress);
      }
      if (isConnected) {
        const user: any = await userDetails(address);
        const referralData = await getReferralsOfUser(address);
         setReferrals(referralData);
        console.log("referral are---->", referralData);
        console.log("user details---->", user);
        const res: any = convertToEther(Number(user[1]));
        const ref: any = convertToEther(Number(user[3]));

        setReferralReward(parseFloat(ref)?.toFixed(2));
        setTotalReferrer(Number(user[4]));
      }
    })();
    
  }, [address]);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        closeSettings();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

    const handleNextPage = () => {
      setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
      setCurrentPage((prev) => prev - 1);
    };

    const paginatedData = referrals.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  return (
    <>
      <div className="lg:-mt-20  lg:ml-[250px] p-4 pb-0 md:pb-4  lg:p-0 pt-20">
        <Header heading="Refer CGate" />
      </div>
      <div className="fixed -z-10 overflow-hidden ] ">
        <img className="fixed w-full h-[1500px] md:h-auto" src={bg} alt="" />
      </div>
      {/* ? "pointer-events-none blur-lg"
							: ""
					} transition-all duration-300  w-[95%] mx-auto md:w-auto ` */}
      <div
        className={`relative w-full text-left text-base text-black -mt-7 p-4 md:p-0 transition-all duration-300 ${
          openRefCard ? "pointer-events-none blur-lg" : ""
        }`}
      >
        <div className="lg:absolute lg:top-[100px] -z-10  mt-10 md:mt-0 rounded-xl  bg-white shadow-xl lg:w-[720px] flex flex-col items-start justify-start p-8  border gap-[6px] text-sm">
          <div className="self-stretch flex flex-row items-center justify-start ">
            <div className="flex-1 flex flex-row items-center justify-end gap-[5px]">
              <div className="flex-1 relative leading-[24px] font-semibold text-[16px]">
                My referral link
              </div>
              <img
                className="relative w-4 h-4 hidden"
                alt=""
                src="/group-1627262.svg"
              />
            </div>
          </div>
          <div className="self-stretch relative leading-[24px] text-gray1">
            <p className="m-0">
              Earn 5% of the earnings claimed by your referred contacts.
            </p>
            <p className="m-0">&nbsp;</p>
            <p className="m-0 text-colors-neutral-800">
              Share referral link from below and start to earn now! Your
              contacts need to use your referral link when depositing CG8.
            </p>
          </div>
          <div className="w-full  mx-auto text-base md:text-lg lg:text-xl leading-tight font-medium ">
            <h1 className="break-words">{referralLink}</h1>
          </div>
          <div className="flex flex-row items-center justify-start gap-[8px] text-sm text-white -ml-10">
            <div className="rounded-round-buttons w-[120px] flex flex-row items-center justify-center">
              <div className="rounded-3xl bg-blue-600 flex flex-row items-center justify-center py-3  gap-[8px]">
                <button
                  className="relative leading-[10px] font-medium w-20 text-xs"
                  onClick={copyToClipboard}
                >
                  {copied ? "Copied!" : "Copy link"}
                </button>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M16 0C7.16343 0 0 7.20722 0 16.0978C0 24.1327 5.85096 30.7923 13.5 32V20.751H9.43748V16.0978H13.5V12.5513C13.5 8.51675 15.8887 6.2882 19.5434 6.2882C21.2939 6.2882 23.125 6.60261 23.125 6.60261V10.5642H21.1074C19.1199 10.5642 18.5 11.8051 18.5 13.0782V16.0978H22.9375L22.2282 20.751H18.5V32C26.149 30.7923 32 24.1327 32 16.0978C32 7.20722 24.8365 0 16 0Z"
                fill="url(#paint0_linear_972_11952)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_972_11952"
                  x1="32"
                  y1="9.8753e-07"
                  x2="-0.561361"
                  y2="32.1828"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#00C3DD" />
                  <stop offset="0.734388" stop-color="#2563EB" />
                </linearGradient>
              </defs>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
            >
              <path
                d="M17.0014 31.1663C9.17735 31.1663 2.83472 24.8236 2.83472 16.9997C2.83472 9.17564 9.17735 2.83301 17.0014 2.83301C24.8254 2.83301 31.1681 9.17564 31.1681 16.9997C31.1681 24.8236 24.8254 31.1663 17.0014 31.1663ZM12.5958 18.6583L12.6137 18.647C13.435 21.3583 13.8456 22.7141 13.8456 22.7141C14.0047 23.154 14.2233 23.2324 14.4887 23.1966C14.7539 23.1606 14.8947 23.0171 15.0678 22.8501C15.0678 22.8501 15.6292 22.3082 16.7521 21.2246L20.3659 23.8986C21.0243 24.2624 21.4998 24.0746 21.6632 23.2864L24.0118 12.2063C24.271 11.1749 23.8163 10.7613 23.0166 11.0887L9.22812 16.4147C8.28744 16.7928 8.29199 17.3191 9.05686 17.5537L12.5958 18.6583Z"
                fill="#0EA5E9"
              />
            </svg>
            <img className="relative w-6  object-cover" alt="" src={insta} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
            >
              <path
                d="M17.0014 2.83301C24.8254 2.83301 31.1681 9.17564 31.1681 16.9997C31.1681 24.8236 24.8254 31.1663 17.0014 31.1663C14.4034 31.1663 11.9687 30.4671 9.87538 29.2463L2.84064 31.1663L4.75592 24.1276C3.53449 22.0339 2.83472 19.5985 2.83472 16.9997C2.83472 9.17564 9.17735 2.83301 17.0014 2.83301ZM11.8891 10.3531C11.7058 10.366 11.5261 10.4108 11.3625 10.4945C11.2397 10.5573 11.1258 10.6481 10.9467 10.8171C10.7776 10.9768 10.6796 11.1162 10.5764 11.2506C10.0526 11.9325 9.77116 12.7696 9.77638 13.6294C9.77923 14.3244 9.95977 14.9999 10.2449 15.6306C10.8231 16.9096 11.7766 18.2616 13.0361 19.5155C13.3386 19.8167 13.635 20.1212 13.9546 20.4025C15.5179 21.7789 17.3808 22.7715 19.3952 23.3013C19.3952 23.3013 20.1885 23.4231 20.2001 23.4238C20.4629 23.438 20.7253 23.419 20.9883 23.4056C21.401 23.3843 21.8039 23.2727 22.1686 23.0784C22.403 22.9536 22.5139 22.8916 22.7107 22.7675C22.7107 22.7675 22.7711 22.7267 22.8875 22.64C23.0788 22.4975 23.1969 22.3972 23.356 22.232C23.4733 22.1102 23.5742 21.9662 23.6521 21.804C23.7629 21.5728 23.8744 21.1315 23.9187 20.765C23.9526 20.4851 23.9424 20.3321 23.9387 20.2373C23.9326 20.0849 23.8067 19.9281 23.6687 19.8615L22.8449 19.4912C22.8449 19.4912 21.6131 18.9551 20.8597 18.6114C20.7812 18.5756 20.6954 18.559 20.6091 18.5538C20.4201 18.5421 20.2083 18.5914 20.0736 18.7334C20.0665 18.7306 19.9727 18.8116 18.9478 20.0533C18.8912 20.1209 18.7588 20.2678 18.5297 20.254C18.4951 20.2516 18.4607 20.2467 18.4271 20.2379C18.3344 20.2134 18.244 20.1811 18.1556 20.1437C17.9803 20.0693 17.9188 20.0411 17.7991 19.9895C16.9813 19.6323 16.2307 19.1543 15.5673 18.5693C15.3894 18.4127 15.2239 18.2439 15.0534 18.0786C14.4581 17.5016 13.9707 16.8879 13.6082 16.2826C13.5884 16.2495 13.5579 16.2018 13.525 16.1484C13.4657 16.0519 13.4003 15.9372 13.3798 15.8584C13.3271 15.65 13.4668 15.4826 13.4668 15.4826C13.4668 15.4826 13.8116 15.1056 13.9718 14.9006C14.126 14.7033 14.259 14.5103 14.3437 14.3727C14.5106 14.1045 14.5635 13.8272 14.4758 13.6133C14.0783 12.6443 13.6683 11.6806 13.2456 10.7223C13.1622 10.5332 12.9141 10.3958 12.6885 10.3698C12.6121 10.3609 12.5357 10.3521 12.459 10.347C12.2691 10.3378 12.0788 10.3398 11.8891 10.3531Z"
                fill="#22C55E"
              />
            </svg>
          </div>
        </div>
        {/* ------------------------------------------------------------------------------------------------------------------------------- */}
        <div className="absolute top-[420px] rounded-xl bg-white shadow-xl lg:w-[720px] w-[92%]  p-8 border my-5 md:my-0 -z-10">
          <div className="flex justify-between w-full mx-auto">
            <div>
              <h1 className="text-xl font-semibold">My referral stats</h1>
            </div>
            <button
              onClick={() => {
                setopenRefsetting(!openRefsetting);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="42"
                height="24"
                viewBox="0 0 42 24"
                fill="none"
              >
                <path
                  d="M0 12C0 5.37258 5.37258 0 12 0H30C36.6274 0 42 5.37258 42 12C42 18.6274 36.6274 24 30 24H12C5.37258 24 0 18.6274 0 12Z"
                  fill="#CCFBF1"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.49509 9C7.86517 9 6.54102 10.3459 6.54102 11.9975C6.54102 13.6516 7.86517 15 9.49509 15C11.125 15 12.4492 13.6516 12.4492 11.9975C12.4492 10.3459 11.125 9 9.49509 9ZM20.538 9C18.9081 9 17.5839 10.3459 17.5839 11.9975C17.5839 13.6516 18.9081 15 20.538 15C22.1679 15 23.4921 13.6516 23.4921 11.9975C23.4921 10.3459 22.1679 9 20.538 9ZM28.6328 11.9975C28.6328 10.3459 29.957 9 31.5869 9C33.2168 9 34.541 10.3459 34.541 11.9975C34.541 13.6516 33.2168 15 31.5869 15C29.957 15 28.6328 13.6516 28.6328 11.9975Z"
                  fill="#0D9488"
                />
              </svg>
            </button>
          </div>

          {openRefsetting ? (
            <div
              ref={settingsRef}
              className="p-3 px-12 rounded-3xl absolute bg-white sm:ml-[75%] ml-[30%] border-gray-50 shadow-xl shadow-gray-300"
            >
              <button
                className="text-teal-600 whitespace-nowrap"
                onClick={() => {
                  setopenRefCard(!openRefCard);
                }}
              >
                Referral history
              </button>
            </div>
          ) : (
            ""
          )}

          <div className="md:flex justify-between w-full mt-8">
            <div>
              <h1>Total referrals</h1>
              <h1 className="text-4xl font-semibold mt-4">{totalReferrer}</h1>
            </div>
            <div>
              <h1 className="mt-5 md:mt-0">Total referral rewards</h1>
              <h1 className="text-4xl font-semibold mt-4">
                {referrerReward} USDC
              </h1>
            </div>
          </div>
        </div>
        {/* ------------------------------------------------------------------------------------------------------------------------------- */}
      </div>
      {openRefCard ? (
        <div
          ref={settingsRef}
          className="absolute lg:top-[130px] top-[200px] ml-5 md:ml-0  lg:left-[350px] rounded-xl bg-white shadow-xl lg:w-[720px] flex flex-col items-start justify-center p-8 border "
        >
          <div className="self-stretch flex flex-row items-center justify-start gap-[24px] mb-4">
            <div className="flex-1 flex flex-row items-center justify-end gap-[10px]">
              <div className="flex-1 relative leading-[24px] font-medium ">
                My referral details
              </div>
            </div>

            <div className="md:flex flex-row items-center justify-start gap-[16px] text-greys-blue-gray-500 hidden"></div>

            <button
              className="md:hidde"
              onClick={() => {
                window.location.reload();
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
            </button>
          </div>
          <div className="self-stretch flex flex-col items-start justify-start gap-[4px] text-sm text-neutral-800">
            <table className="self-stretch table-auto text-left text-sm">
              <thead className="bg-[#F5F6FE]">
                <tr>
                  <th className="p-3 text-base text-black leading-[14px] font-medium">
                    Wallet
                  </th>
                  <th className="p-3 text-base text-black leading-[24px] font-medium">
                    Collected rewards
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  referrals
                    .reduce((uniqueReferrals, referral) => {
                      const existingReferral = uniqueReferrals.find(
                        (r) => r.referral === referral.referral
                      );
                      const rewardValue = Number(referral.reward);
                      if (rewardValue > 0) {
                        // Only process non-zero rewards
                        if (existingReferral) {
                          existingReferral.reward += rewardValue;
                        } else {
                          uniqueReferrals.push({
                            ...referral,
                            reward: rewardValue,
                          });
                        }
                      }
                      return uniqueReferrals;
                    }, [])
                    .filter((referral) => referral.reward > 0) // Additional filter to ensure no zero rewards slip through
                    .map((referral, index) => {
                      const rewardInEther: any = convertToEther(
                        referral.reward.toString()
                      );
                      if (rewardInEther > 0) {
                        // Only render if the converted value is greater than zero
                        return (
                          <tr
                            key={index}
                            className="border-b border-greys-blue-gray-200"
                          >
                            <td className="p-3">
                              <div className="leading-[10px]">
                                {referral.referral}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="font-semibold leading-[24px]">
                                <p className="m-0 text-xs leading-[16px]">
                                  {rewardInEther} USDc
                                </p>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return null; // Return null for zero values, which won't be rendered by React
                    })
                    .filter(Boolean) // Remove any null entries from the map operation
                }
              </tbody>
            </table>
            <div className="flex justify-between w-full items-center mt-4">
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
                disabled={currentPage * ITEMS_PER_PAGE >= referrals.length}
                className={`bg-gray-300 text-gray-700 font-light text-sm py-2 px-4 rounded-3xl ${
                  currentPage * ITEMS_PER_PAGE >= referrals.length
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Next
              </button>
            </div>
            <div className="self-stretch relative bg-greys-blue-gray-200 box-border h-px border-[1px] border-solid border-greys-blue-gray-200" />
          </div>

          <div className="self-stretch  text-gray-600 text-sm mt-3">
            Referred by: {refAddress?refAddress:"0x"}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Referral;
