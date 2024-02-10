import { FunctionComponent } from "react";
import arrow from "../../assets/arrow-down-circle-fill.svg";
const Swapcomp: FunctionComponent = () => {
	return (
		<>
			<div className=' cursor-pointer text-left text-sm text-blue bg-gray-200 w-full pl-10 -ml-10'>
				<div className='mt-10 mb-5 h-8 text-3xl '>
					<div className=' overflow-hidden  '>
						Welcome to CG8 swap
					</div>
				</div>
				<div className=' bg-colors-white w-[500px] overflow-hidden flex flex-col items-center justify-start p-6  gap-[20px] bg-white rounded-2xl'>
					<div className='self-stretch flex flex-col items-start justify-center gap-[16px]'>
						<div className='self-stretch flex flex-row items-center justify-start gap-[14px]'>
							<div className='flex-1 flex flex-col items-start justify-center gap-[8px] text-xl text-heading'>
								<div className='self-stretch  leading-[130%]'>
									Swap CG8
								</div>
							</div>
							<div className=' underline text-teal-600'>
								History
							</div>
							<div className=' underline text-teal-600'>
								Liquidity
							</div>
							<div className=' underline text-teal-600'>
								Settings
							</div>
						</div>

						<div className='self-stretch  bg-neutral-300 h-[1px]' />
					</div>
					<div className='self-stretch flex flex-col items-center justify-start gap-[10px] text-neutral-800'>
						<div className='self-stretch rounded-lg  bg-sky-50 flex flex-col items-end justify-center py-2.5 px-3.5 gap-[6px]'>
							<div className='self-stretch    font-medium'>
								Buy
							</div>
							<div className='self-stretch rounded-md overflow-hidden flex flex-row items-end justify-start gap-[24px] text-sm text-neutral-600'>
								<div className='self-stretch w-[280px] h-[80px] flex flex-col items-start justify-start gap-[4px]'>
									<div className='self-stretch flex-1 rounded-lg bg-white flex flex-row  justify-start  gap-[8px] border-1 border-gray-800  '>
										<input
											type='number'
											placeholder='0.00'
											className='flex-1 pl-3  text-3xl rounded-md text-neutral-400 w-4 border '
										/>
										<p className='absolute top-[270px] left-[310px] text-gray-400 '>
											~$10.00
										</p>
									</div>
								</div>

								<div className='flex-1 h-[76px] flex flex-col items-start justify-start gap-[4px]'>
									<div className='self-stretch hidden flex-row items-start justify-start gap-[2px] text-colors-negative-600'>
										<div className='flex-1   text-neutral-600 overflow-hidden '>
											Label
										</div>
									</div>

									<div className='self-stretch flex-1 rounded-lg bg-white flex flex-row items-center justify-start  gap-[8px] border-[1px] border-solid border-neutral-300'>
										<select
											name=''
											id=''
											className='flex-1 text-lg p-1'>
											<option value=''>CG8</option>
											<option value=''>CG8</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div className='self-stretch rounded-3xs bg-sky-50 flex flex-col items-end justify-center pt-2.5 px-3.5 pb-4 gap-[6px]'>
							<div className='self-stretch  font-medium'>
								Sell
							</div>
							<div className='self-stretch rounded-md overflow-hidden flex flex-row items-end justify-start gap-[24px] text-sm text-neutral-600 '>
								<div className='self-stretch w-[280px] h-[80px] flex flex-col items-start justify-start gap-[4px]'>
									<div className='self-stretch flex-1 rounded-lg bg-white flex flex-row  justify-start  gap-[8px] border-1 border-gray-800 '>
										<input
											type='number'
											placeholder='0.00'
											className='flex-1 pl-3 rounded-md  text-3xl  text-neutral-400 w-4 border '
										/>
										<p className='absolute top-[405px] left-[310px] text-gray-400'>
											~$10.00
										</p>
									</div>
								</div>

								<div className='flex-1 h-[76px] flex flex-col items-start justify-start gap-[4px]'>
									<div className='self-stretch hidden flex-row items-start justify-start gap-[2px] text-colors-negative-600'>
										<div className='flex-1  text-colors-neutral-600 overflow-hidden text-ellipsis whitespace-nowrap'>
											Label
										</div>
									</div>
									<div className='self-stretch flex-1 rounded-lg bg-white flex flex-row items-center justify-start gap-[8px] border-1 border-neutral-300 '>
										<select
											name=''
											id=''
											className='flex-1 text-lg p-1'>
											<option value=''>USD</option>
											<option value=''>INR</option>
										</select>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='flex justify-around '>
						<div className='mr-32 text-base'>
							<p>1.00 USDC = 1.00 CG8 (~$1)</p>
						</div>
						<div className='flex'>
							<svg
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									d='M3 19V4C3 3.44772 3.44772 3 4 3H13C13.5523 3 14 3.44772 14 4V12H16C17.1046 12 18 12.8954 18 14V18C18 18.5523 18.4477 19 19 19C19.5523 19 20 18.5523 20 18V11H18C17.4477 11 17 10.5523 17 10V6.41421L15.3431 4.75736L16.7574 3.34315L21.7071 8.29289C21.9024 8.48816 22 8.74408 22 9V18C22 19.6569 20.6569 21 19 21C17.3431 21 16 19.6569 16 18V14H14V19H15V21H2V19H3ZM5 5V11H12V5H5Z'
									fill='#475569'
								/>
							</svg>{" "}
							<p className='text-base font-semibold ml-1'>
								$ 0.1
							</p>
						</div>
					</div>
					<div className=' bg-blue  h-11 flex flex-row items-center justify-center py-gap-md1  box-border gap-[8px]  text-white'>
						<button className=' bg-indigo-400 px-8 py-3 rounded-lg w-[430px] text-white font-medium'>
							Swap CG8
						</button>
					</div>
				</div>
				<img
					className='absolute top-[277px] left-[500px] w-[42px] h-[42px] overflow-hidden'
					alt=''
					src={arrow}
				/>
				<div className='absolute  top-[245px] left-[500px] underline text-teal-500 font-medium'>
					MAX
				</div>
				<div className='absolute  top-[375px] left-[500px] underline text-teal-500 font-medium'>
					MAX
				</div>
			</div>
			{/* // <div>

            //     <Transaction/>
            // </div> */}
		</>
	);
};

export default Swapcomp;
