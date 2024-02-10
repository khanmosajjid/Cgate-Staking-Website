import React from "react";

interface WithdrawalHistoryProps {
	setOpenWithdrawHistory: (value: boolean) => void;
}
type WithdrawalType = {
	amount: string;
	amount2: string;
	datetime: string;
	maturitydatetime: string;
};

const WithdrawalHistory = ({
	setOpenWithdrawHistory,
}: WithdrawalHistoryProps) => {
	const withdrawalHistory = [
		{ amount: "10.00 CG8", date: "12 Sep 2023, 10:16" },
		{ amount: "10.00 CG8", date: "12 Sep 2023, 10:16" },
		{ amount: "10.00 CG8", date: "12 Sep 2023, 10:16" },
		// ... more history items
	];

	const downloadCSV = () => {
		// Logic to download the CSV file
		console.log("Downloading CSV...");
	};

	return (
		<div className='fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center  items-center p-4 '>
			<div className='bg-[#F5F6FE] rounded-xl shadow-lg overflow-auto md:w-[700px] w-[96%] p-4'>
				<div className='flex justify-between items-center p-4 border-b'>
					<h2 className='text-[16px]'>My withdrawal history</h2>
					<button
						onClick={() => {
							/* close modal function */
							setOpenWithdrawHistory(false); //
						}}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='18'
							height='18'
							viewBox='0 0 18 18'
							fill='none'>
							<path
								d='M17 1L1 17'
								stroke='#475568'
								stroke-width='2'
								stroke-linecap='round'
								stroke-linejoin='round'
							/>
							<path
								d='M1 1L17 17'
								stroke='#475568'
								stroke-width='2'
								stroke-linecap='round'
								stroke-linejoin='round'
							/>
						</svg>
					</button>
				</div>
				<div className='p-4'>
					<div className='md:flex justify-between mb-2 hidden bg-white rounded-3xl p-3'>
						<span className='font-'>Amount</span>
						<span className='font- md:mr-20'>
							Withdraw date/time
						</span>
					</div>
					<div className=' overflow-y-scroll md:h-[180px]'>
						{withdrawalHistory.map((item, index) => (
							<div
								key={index}
								className='md:flex justify-between py-2 border-b md:mx-4 mb-2'>
								<div>
									<span className='md:block font-semibold md:font-normal'>
										{item.amount}
									</span>
                                    
									<span className='md:text-xs font-semibold md:font-normal ml-2 md:ml-0'>
										(~$10.00)
									</span>
								</div>
								<span className='md:mr-20 font-light md:font-normal'>{item.date}</span>
							</div>
						))}
					</div>
					<div className='flex  mt-4'>
						<button
							className='bg-teal-600 rounded-3xl text-gray-200 px-8 py-2 text-sm  hover:bg-green-600 transition duration-300'
							onClick={downloadCSV}>
							Download in CSV
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WithdrawalHistory;
