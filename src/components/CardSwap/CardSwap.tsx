/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState,useRef, useEffect } from "react";
interface cardSwapProps {
	setState: (value: boolean) => void;
	heading: string;
	heading2?: string;
	subHeading?: string;
	time?:string;
	btntext: string;
	p?: string;
	svg?: JSX.Element | any;
	svg2?: JSX.Element | any;
	onClick: () => void;
}

const CardSwap = ({
	setState,
	svg,
	heading,
	heading2,
	subHeading,
	time,
	p,
	svg2,
	btntext,
	onClick,
}: cardSwapProps) => {
	const [openCard, setopenCard] = useState(false);
	const settingsRef = useRef(null);

	console.log("pool time is---->",subHeading,time);

	// Function to close the settings div
	const closeSettings = () => {
		setopenCard(false);
	};

	// Event listener to close settings if clicked outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				settingsRef.current &&
				!settingsRef.current.contains(event.target)
			) {
				closeSettings();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<>
			<div className=' p-10 pb-5 bg-white border text-center rounded-2xl w-[400px]'>
				<button
					className='absolute ml-[150px] -mt-2 text-lg'
					onClick={() => {
						setState(false);
					}}>
					X
				</button>
				<div className=' ml-28 '>{svg}</div>
				<h1 className='mt-4 my-4 font-semibold text-[24px]'>
					{heading}
				</h1>
				<div className='flex mx-auto text-center items-center justify-center gap-2'>
					<img src={svg2} alt='' />
					<div>
						<h1 className='mt-1'>{heading2}</h1>
						<h1 className='text-xs font-light text-gray-700'>
							{subHeading}
						</h1>
						<h1
							className={`text-xs font-light ${ heading == "Confirm your claim" ? "" : "hidden"}`}>
							CG8 locked for {time} days
						</h1>
					</div>
				</div>
				<button
					className='text-xs text-teal-600 my-5'
					onClick={() => {
						setopenCard(!openCard);
					}}>
					{p}
				</button>

				{/* <hr /> */}
				<button
					className=' px-20 md:w-80 py-2 bg-teal-600 text-white rounded-2xl text-sm mt-3'
					onClick={onClick}
					ref={settingsRef}>
					{btntext}
				</button>
			</div>
			{openCard ? (
				<div className=' p-2 rounded-xl '>
					<h1 className='text-[12px] absolute bg-orange-50 -mt-24 md:ml-60 p-2 rounded-b-2xl  w-[400px]'>
						Enabling pool means giving a user’s approval to a pool
						smart contract to work with tokens stored in a user’s
						non-custodial wallet. This action is mandatory because
						the smart contracts are unable to interact with tokens
						without a wallet owner’s consent. Enabling a pool is
						required once (unless it was revoked afterwards) only
						when a user connects with a pool for the first time.
					</h1>
				</div>
			) : (
				""
			)}
		</>
	);
};

export default CardSwap;
