import { FunctionComponent } from "react";
import X from "./assets/X.svg";
import Bitcoin from "./assets/bitcoin.svg";

const WalletDetails: FunctionComponent = () => {
	return (
		<div className='absolute top-[100px] left-[calc(50%_-_300px)] rounded-xl bg-white shadow-lg w-[600px] flex flex-col items-center justify-start p-8 box-border gap-[24px] text-gray-700 border'>
			<div className='self-stretch flex flex-row items-center justify-start'>
				<div className='flex-1 flex flex-row items-center justify-end gap-[10px]'>
					<div className='flex-1 relative leading-[24px] font-medium'>
						Wallet details
					</div>
					<button>
						<img
							className='relative w-[18px] h-[18px]'
							alt=''
							src={X}
						/>
					</button>
				</div>
			</div>
			<div className='self-stretch flex flex-col items-center justify-start gap-[10px]'>
				<div className='self-stretch relative leading-[24px]'>
					Balance
				</div>
				<div className='rounded-round-corner w-[536px] flex flex-row items-center justify-start gap-[10px] text-5xl'>
					<img
						className='relative w-[40.11px] h-[40.11px]'
						alt=''
						src={Bitcoin}
					/>
					<div className='relative leading-[32px] font-medium inline-block w-[191px] shrink-0 text-lg'>
						10.00 Matic
					</div>
				</div>
			</div>
			<div className='self-stretch flex flex-col items-center justify-start'>
				<div className='self-stretch flex flex-row items-start justify-start'>
					<div className='flex-1 relative leading-[24px] inline-block h-[25px] mix-blend-normal'>
						Wallet address: ls654...45h12
					</div>
				</div>
			</div>
			<div className='self-stretch relative  box-border h-px border-[1px] border-solid ' />
			<div className='self-stretch flex flex-row items-start justify-center text-sm text-basic-white'>
				<div className='flex-1 rounded-round-buttons flex flex-row items-center justify-center'>
					<div className='flex-1 rounded-round-buttons  flex flex-row items-center justify-center p-4 gap-[8px] bg-teal-600 rounded-2xl'>
						<div className='relative leading-[20px] font-medium text-white'>
							Disconnect wallet
						</div>
						<img
							className='relative w-4 h-4 overflow-hidden shrink-0 hidden'
							alt=''
							src='/right-icon3.svg'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WalletDetails;
