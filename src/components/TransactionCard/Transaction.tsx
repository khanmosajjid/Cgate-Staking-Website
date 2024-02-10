const Transaction = () => {
	return (
		<div className='bg-white border shadow-lg p-5 mx-auto w-[530px] rounded-xl '>
			<div>
				<h1 className='text-2xl  mb-3'>Transaction summary</h1>
				<hr />

				<div className='flex'>
					<div className='mt-3 mb-3 mr-40'>
						<h3>Buy</h3>
						<h1 className='text-2xl font-semibold py-3'>
							10.00 CG8
						</h1>
						<p className='text-gray-400'>~ $ 10.00</p>
					</div>
					<div className='mt-3 mb-3'>
						<h3>Sell</h3>
						<h1 className='text-2xl font-semibold py-3'>
							10.00 USDC
						</h1>
						<p className='text-gray-400'>~ $ 10.00</p>
					</div>
				</div>
				<hr className='mt-3' />

				<div className='flex justify-between text-gray-600 py-4'>
					<div className='font-light text-sm'>
						<p className='p-2'>Exchange rate</p>
						<p className='p-2'>Slippage tolerance (?)</p>
						<p className='p-2'>Transaction deadline (?)</p>
					</div>

					<div className='font-light text-right text-gray-600'>
						<p className='p-2 text-sm'>
							1.00 USDC = 1.00 CG8 (~$1.00)
						</p>
						<p className='p-2'>
							1.00%
							<span className='ml-2 text-blue-500'>Change</span>
						</p>
						<p className='p-2'>
							Default
							<span className='ml-2 text-blue-500'>Change</span>
						</p>
					</div>
				</div>

				<div className='flex justify-between'>
					<button className='w-60 text-blue-500 px-5 py-2 rounded-lg border border-blue-500'>
						Back
					</button>
					<button className='w-60 px-5 py-2 rounded-lg border bg-blue-500 text-white'>
						Confirm Swap
					</button>
				</div>
			</div>
		</div>
	);
};

export default Transaction;
