/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bnb from "../../assets/BNB.jpg";
import { ConnectWallet } from "./ConnectWallet.js";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { stakingContract } from "../../utils/web3Utils.js";
import { getNetwork } from "@wagmi/core";
import React, { useEffect, useRef } from "react";


interface HeaderProps {
  heading: String;
}

const Header = ({ heading }: HeaderProps) => {
 
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const connectButtonRef: any = useRef(null);

  return (
    <>
      <div className="lg:fixed lg:top-[16px] md:w-[1096px] flex flex-row items-center justify-between text-2xl text-black -z-10 ">
        <div className="flex-1  leading-[32px] font-semibold text-gray-50 -z-10">
          {heading}
        </div>
        <div className="md:flex flex-row items-center justify-end gap-[16px] text-sm hidden">
          <div className="rounded-2xl bg-white flex flex-row items-center justify-center py-2 px-2 gap-[10px] border-[1px] border-solid border-gray-200">
            <img className="h-5 w-5" src={bnb} alt="" />
            {chain?.id != chains[0]?.id ? (
              <button
                onClick={() => {
                  switchNetwork(chains[0]?.id);
                }}
              >
                WRONG NETWORK! Switch To BSC
              </button>
            ) : (
              <p>{chain?.name}</p>
            )}
          </div>
          <div className="">
            <ConnectWallet></ConnectWallet>
          </div>
          {/* <img
							className='relative w-[10.5px] h-1.5'
							alt=''
							src='/vector6.svg'
						/> */}
          <div></div>
          {/* <button>Wallet</button> */}
        </div>
        {/* <CardSwap/> */}
      </div>
    </>
  );
};

export default Header;
