import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
// import React from "react";
import logo from "../../assets/BNB.jpg";
// import globe from "../../assets/globe.svg"; // Import your icon
import twt from "../../assets/twt.svg"; // Import your icon
import vertor2 from "../../assets/Vector2.svg"; // Import
import globe from "../../assets/globe.svg"; // Import your icon
// import { ConnectWallet } from "../Header/ConnectWallet";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import cg8 from "../../assets/CG8.svg";
import { getMinAmountIn } from "../../utils/web3Utils";

const SidebarMobile = () => {
  const [state, setState] = useState(false);
  const location = useLocation(); // Added line
  const handleClick = () => {
    setState(!state);
  };

  const [cg8Price, setCg8Price] = useState<string>(); // Change unknown to string

  useEffect(() => {
    const getCG8Balance = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let price: any = await getMinAmountIn("1");
      price = parseFloat(price).toFixed(2);
      setCg8Price(price);
    };
    getCG8Balance();
  }, []);

  let colorhome = "#475568";
  let colordashboard = "#475568";
  let colorswap = "#475568";
  let colordeposit = "#475568";
  let colorref = "#475568";

  if (location.pathname == "/") {
    colorhome = "#0D9488";
  } else if (location.pathname == "/dashboard") {
    colordashboard = "#0D9488";
  } else if (location.pathname == "/swap") {
    colorswap = "#0D9488";
  } else if (location.pathname == "/deposit") {
    colordeposit = "#0D9488";
  } else if (location.pathname == "/referral") {
    colorref = "#0D9488";
  }
  const sidebarNavItems = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
        >
          <path
            d="M15.3458 26.207H20.0813V19.8415C20.0813 19.4663 19.8494 19.225 19.4886 19.225H15.945C15.5842 19.225 15.3458 19.4663 15.3458 19.8415V26.207ZM12.0921 26.9508H23.3093C24.4432 26.9508 25.0875 26.2874 25.0875 25.1283V15.5934L23.9471 14.7759V24.8401C23.9471 25.4499 23.6507 25.7648 23.0644 25.7648H12.3305C11.7507 25.7648 11.4543 25.4499 11.4543 24.8401V14.7826L10.3139 15.5934V25.1283C10.3139 26.2942 10.9582 26.9508 12.0921 26.9508ZM8.00732 17.3422C8.00732 17.6438 8.23283 17.9251 8.6194 17.9251C8.81269 17.9251 8.97376 17.818 9.11551 17.6906L17.414 10.454C17.6073 10.2731 17.8328 10.2597 18.0453 10.454L26.3245 17.6906C26.4727 17.818 26.6274 17.9251 26.8271 17.9251C27.1621 17.9251 27.4263 17.7107 27.4263 17.3623C27.4263 17.1412 27.3554 16.9871 27.2007 16.853L18.6639 9.38193C18.084 8.87269 17.3818 8.87269 16.7954 9.38193L8.23927 16.853C8.0782 16.9871 8.00732 17.168 8.00732 17.3422ZM23.1933 13.7306L25.0875 15.399V11.4122C25.0875 11.0772 24.8749 10.8628 24.5527 10.8628H23.7345C23.4123 10.8628 23.1933 11.0772 23.1933 11.4122V13.7306Z"
            fill={colorhome}
          />
        </svg>
      ), // Use the imported icon component
      display: "Home",
      to: "/",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill={colordashboard}
        >
          <mask id="path-1-inside-1_1536_23373" fill="white">
            <path d="M21.8746 28H25.3754C26.8252 28 28 26.8252 28 25.3754V21.8746C28 20.4248 26.8252 19.25 25.3754 19.25H21.8746C20.4248 19.25 19.25 20.4248 19.25 21.8746V25.3754C19.25 26.8252 20.4248 28 21.8746 28Z" />
          </mask>
          <path
            d="M21.8746 26.5H25.3754V29.5H21.8746V26.5ZM25.3754 26.5C25.9968 26.5 26.5 25.9968 26.5 25.3754H29.5C29.5 27.6536 27.6536 29.5 25.3754 29.5V26.5ZM26.5 25.3754V21.8746H29.5V25.3754H26.5ZM26.5 21.8746C26.5 21.2532 25.9968 20.75 25.3754 20.75V17.75C27.6536 17.75 29.5 19.5964 29.5 21.8746H26.5ZM25.3754 20.75H21.8746V17.75H25.3754V20.75ZM21.8746 20.75C21.2532 20.75 20.75 21.2532 20.75 21.8746H17.75C17.75 19.5964 19.5964 17.75 21.8746 17.75V20.75ZM20.75 21.8746V25.3754H17.75V21.8746H20.75ZM20.75 25.3754C20.75 25.9968 21.2532 26.5 21.8746 26.5V29.5C19.5964 29.5 17.75 27.6536 17.75 25.3754H20.75Z"
            fill={colordashboard}
            mask="url(#path-1-inside-1_1536_23373)"
          />
          <mask id="path-3-inside-2_1536_23373" fill="white">
            <path d="M10.6246 28H14.1254C15.5752 28 16.75 26.8252 16.75 25.3754V21.8746C16.75 20.4248 15.5752 19.25 14.1254 19.25H10.6246C9.17479 19.25 8 20.4248 8 21.8746V25.3754C8 26.8252 9.17479 28 10.6246 28Z" />
          </mask>
          <path
            d="M10.6246 26.5H14.1254V29.5H10.6246V26.5ZM14.1254 26.5C14.7468 26.5 15.25 25.9968 15.25 25.3754H18.25C18.25 27.6536 16.4036 29.5 14.1254 29.5V26.5ZM15.25 25.3754V21.8746H18.25V25.3754H15.25ZM15.25 21.8746C15.25 21.2532 14.7468 20.75 14.1254 20.75V17.75C16.4036 17.75 18.25 19.5964 18.25 21.8746H15.25ZM14.1254 20.75H10.6246L10.6246 17.75H14.1254V20.75ZM10.6246 20.75C10.0032 20.75 9.5 21.2532 9.5 21.8746H6.5C6.5 19.5964 8.34636 17.75 10.6246 17.75L10.6246 20.75ZM9.5 21.8746V25.3754H6.5L6.5 21.8746H9.5ZM9.5 25.3754C9.5 25.9968 10.0032 26.5 10.6246 26.5V29.5C8.34636 29.5 6.5 27.6536 6.5 25.3754H9.5Z"
            fill={colordashboard}
            mask="url(#path-3-inside-2_1536_23373)"
          />
          <mask id="path-5-inside-3_1536_23373" fill="white">
            <path d="M10.6246 16.75H14.1254C15.5752 16.75 16.75 15.5752 16.75 14.1254V10.6246C16.75 9.17577 15.5752 8 14.1254 8H10.6246C9.17479 8 8 9.17577 8 10.6246V14.1254C8 15.5752 9.17479 16.75 10.6246 16.75Z" />
          </mask>
          <path
            d="M10.6246 15.25H14.1254V18.25H10.6246V15.25ZM14.1254 15.25C14.7468 15.25 15.25 14.7468 15.25 14.1254L18.25 14.1254C18.25 16.4036 16.4036 18.25 14.1254 18.25V15.25ZM15.25 14.1254V10.6246H18.25V14.1254L15.25 14.1254ZM15.25 10.6246C15.25 10.0038 14.7464 9.5 14.1254 9.5V6.5C16.404 6.5 18.25 8.34771 18.25 10.6246H15.25ZM14.1254 9.5H10.6246L10.6246 6.5H14.1254V9.5ZM10.6246 9.5C10.0036 9.5 9.5 10.0038 9.5 10.6246H6.5C6.5 8.34771 8.34599 6.5 10.6246 6.5L10.6246 9.5ZM9.5 10.6246V14.1254H6.5L6.5 10.6246H9.5ZM9.5 14.1254C9.5 14.7468 10.0032 15.25 10.6246 15.25V18.25C8.34636 18.25 6.5 16.4036 6.5 14.1254H9.5Z"
            fill={colordashboard}
            mask="url(#path-5-inside-3_1536_23373)"
          />
          <mask id="path-7-inside-4_1536_23373" fill="white">
            <path d="M21.8746 16.75H25.3754C26.8252 16.75 28 15.5752 28 14.1254V10.6246C28 9.17577 26.8252 8 25.3754 8H21.8746C20.4248 8 19.25 9.17577 19.25 10.6246V14.1254C19.25 15.5752 20.4248 16.75 21.8746 16.75Z" />
          </mask>
          <path
            d="M21.8746 15.25H25.3754V18.25H21.8746V15.25ZM25.3754 15.25C25.9968 15.25 26.5 14.7468 26.5 14.1254L29.5 14.1254C29.5 16.4036 27.6536 18.25 25.3754 18.25V15.25ZM26.5 14.1254V10.6246H29.5V14.1254L26.5 14.1254ZM26.5 10.6246C26.5 10.0038 25.9964 9.5 25.3754 9.5V6.5C27.654 6.5 29.5 8.34771 29.5 10.6246H26.5ZM25.3754 9.5H21.8746V6.5H25.3754V9.5ZM21.8746 9.5C21.2536 9.5 20.75 10.0038 20.75 10.6246H17.75C17.75 8.34771 19.596 6.5 21.8746 6.5V9.5ZM20.75 10.6246V14.1254H17.75V10.6246H20.75ZM20.75 14.1254C20.75 14.7468 21.2532 15.25 21.8746 15.25V18.25C19.5964 18.25 17.75 16.4036 17.75 14.1254H20.75Z"
            fill={colordashboard}
            mask="url(#path-7-inside-4_1536_23373)"
          />
        </svg>
      ), // No icon for this item
      display: "Dashboard",
      to: "/dashboard",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill={colorswap}
        >
          <path
            d="M23.3652 26.7569L27.7834 21.7435C27.9187 21.5927 27.9999 21.3891 27.9999 21.1931C27.9999 20.7559 27.7225 20.4618 27.3436 20.4618C27.1542 20.4618 27.0053 20.5297 26.87 20.6805L24.9484 22.8743L23.4599 24.7364L23.5276 22.5351V9.74144C23.5276 9.31926 23.2502 9.00262 22.8645 9.00262C22.4788 9.00262 22.2082 9.31926 22.2082 9.74144V22.5351L22.2759 24.7364L20.7873 22.8743L18.859 20.6805C18.7305 20.5297 18.5816 20.4618 18.3922 20.4618C18.0065 20.4618 17.7358 20.7559 17.7358 21.1931C17.7358 21.3891 17.817 21.5927 17.9524 21.7435L22.3706 26.7569C22.648 27.0735 23.0742 27.0886 23.3652 26.7569Z"
            fill={colorswap}
          />
          <path
            d="M12.6347 9.24316L8.21651 14.2415C8.08119 14.3923 8 14.6034 8 14.7994C8 15.2366 8.27064 15.5307 8.6563 15.5307C8.84575 15.5307 8.99461 15.4553 9.12316 15.312L11.0515 13.1107L12.54 11.2561L12.4723 13.4499V26.251C12.4723 26.6808 12.743 26.9974 13.1286 26.9974C13.5143 26.9974 13.7917 26.6808 13.7917 26.251V13.4499L13.7241 11.2561L15.2126 13.1107L17.1341 15.312C17.2694 15.4553 17.4183 15.5307 17.6078 15.5307C17.9867 15.5307 18.2641 15.2366 18.2641 14.7994C18.2641 14.6034 18.1829 14.3923 18.0476 14.2415L13.6293 9.24316C13.3519 8.92653 12.9189 8.91145 12.6347 9.24316Z"
            fill={colorswap}
          />
        </svg>
      ),
      display: "Swap CG8",
      to: "/swap",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill={colordeposit}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.54617 9.64375C10.5671 8.54807 12.0161 8 13.7429 8H22.2326C23.959 8 25.4078 8.5481 26.4286 9.64378C27.4538 10.7441 27.9746 12.3188 27.9746 14.2022V14.9075H23.4062C21.8477 14.9109 20.6392 16.2604 20.6365 17.8525C20.6347 19.4483 21.8446 20.8035 23.4066 20.8058H27.978V21.7897C27.978 23.673 27.4572 25.2494 26.4324 26.3517C25.4117 27.4495 23.963 28 22.2359 28H13.7429C12.0155 28 10.5665 27.4495 9.54572 26.3517C8.52081 25.2494 8 23.673 8 21.7897V14.2022C8 12.3188 8.52087 10.7441 9.54617 9.64375ZM18.3481 12.0183C19.0382 12.016 19.6563 12.624 19.6595 13.4523C19.6627 14.2813 19.0499 14.8962 18.3581 14.8994L18.3557 14.8994H13.041C12.3497 14.8962 11.7363 14.2818 11.7396 13.4532C11.7428 12.6298 12.3531 12.0215 13.041 12.0183L13.0433 12.0183L18.3481 12.0183Z"
            fill={colordeposit}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24.2703 19.7238C23.3752 19.7396 22.5911 19.1323 22.3945 18.2692C22.3714 18.1539 22.3594 18.0363 22.3594 17.9186C22.3578 16.9134 23.1802 16.0976 24.1984 16.0945H27.3257C27.6981 16.0953 27.9994 16.3938 28.0002 16.761V19.0581C28.0002 19.4261 27.6981 19.7238 27.3257 19.7238H24.2703ZM24.2395 18.8166C24.7587 18.8166 25.1796 18.4103 25.1796 17.9092C25.1796 17.408 24.7587 17.0018 24.2395 17.0018C23.7202 17.0018 23.2993 17.408 23.2993 17.9092C23.2993 18.4103 23.7202 18.8166 24.2395 18.8166Z"
            fill={colordeposit}
          />
        </svg>
      ),
      display: "Deposit",
      to: "/deposit",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill={colorref}
        >
          <path
            d="M10.9859 20.9034H11.8133C11.7688 20.5181 11.737 20.0923 11.7879 19.7069H11.0814C9.01283 19.7069 7.52347 18.1521 7.52347 15.9483C7.52347 13.7581 9.01283 12.1965 11.0814 12.1965H18.3054C20.374 12.1965 21.8633 13.7581 21.8633 15.9483C21.8633 18.1521 20.3803 19.7069 18.3054 19.7069H15.3713C15.2758 19.9976 15.3076 20.5654 15.5113 20.9034H18.4009C21.1123 20.9034 23.0536 18.8754 23.0536 15.9483C23.0536 13.028 21.1123 11 18.4009 11H10.9859C8.28088 11 6.33325 13.028 6.33325 15.9483C6.33325 18.8754 8.28088 20.9034 10.9859 20.9034ZM17.599 25H25.0139C27.7253 25 29.6666 22.972 29.6666 20.0449C29.6666 17.1178 27.7253 15.0898 25.0139 15.0898H24.1865C24.231 15.4819 24.2629 15.9078 24.2183 16.2863H24.9184C26.9934 16.2863 28.4764 17.8411 28.4764 20.0449C28.4764 22.2352 26.987 23.8035 24.9184 23.8035H17.6944C15.6258 23.8035 14.1365 22.2352 14.1365 20.0449C14.1365 17.8411 15.6195 16.2863 17.6944 16.2863H20.635C20.7304 15.9956 20.6986 15.4346 20.4886 15.0898H17.599C14.8875 15.0898 12.9463 17.1178 12.9463 20.0449C12.9463 22.972 14.8875 25 17.599 25Z"
            fill={colorref}
          />
        </svg>
      ),
      display: "Refer CGate",
      to: "/referral",
    },
  ];
  return (
		<div className='w-full fixed z-10 '>
			<div>
				<div
					className={`border-b  flex p-3 justify-between items-center w-full bg-white `}>
					<div className='flex items-center'>
						<svg
							onClick={handleClick}
							xmlns='http://www.w3.org/2000/svg'
							width='30'
							height='20'
							viewBox='0 0 22 16'
							fill='none'>
							<path
								d='M0 16H22V13.3333H0V16ZM0 9.33333H22V6.66667H0V9.33333ZM0 0V2.66667H22V0H0Z'
								fill='black'
							/>
						</svg>
						<div className='flex mx-2'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='30'
								height='30'
								viewBox='0 0 30 30'
								fill='none'>
								<rect
									width='30'
									height='30'
									rx='15'
									fill='#1E40AF'
								/>
								<path
									fillRule='evenodd'
									clipRule='evenodd'
									d='M21.472 12.3662L21.5479 12.5917H23.9141L23.836 12.188C23.7013 11.4915 23.4551 10.8543 23.0964 10.2794C22.7396 9.70309 22.2934 9.20861 21.7595 8.79701C21.2297 8.38074 20.628 8.06235 19.957 7.84023C19.2868 7.61244 18.568 7.5 17.8029 7.5C16.8713 7.5 16.0098 7.66789 15.2224 8.00849C14.4367 8.34836 13.7543 8.8385 13.1781 9.47775C12.6007 10.1184 12.1569 10.8908 11.8441 11.7891L11.8437 11.7901C11.5342 12.6879 11.3823 13.6907 11.3823 14.7941C11.3823 16.2649 11.6487 17.5548 12.1944 18.6526L12.1949 18.6537C12.7435 19.7478 13.5112 20.5982 14.4964 21.196C15.4869 21.7941 16.6292 22.0883 17.9118 22.0883C19.0614 22.0883 20.0932 21.8542 20.9979 21.3772C21.9063 20.8961 22.6232 20.215 23.141 19.3358C23.6669 18.4505 23.924 17.4173 23.924 16.249V14.4571H19.0816V16.5861H21.626C21.5755 17.1759 21.422 17.6901 21.1716 18.1352C20.8628 18.6874 20.4315 19.1159 19.8716 19.4222C19.3169 19.7239 18.6666 19.8799 17.9118 19.8799C17.1016 19.8799 16.3823 19.6858 15.7458 19.3033C15.1147 18.9239 14.6092 18.3632 14.231 17.6075C13.8573 16.8607 13.662 15.9278 13.662 14.7941C13.662 13.66 13.8552 12.7265 14.2249 11.9794C14.5993 11.2227 15.0966 10.6622 15.7142 10.2835C16.3379 9.90119 17.0316 9.70839 17.8029 9.70839C18.2794 9.70839 18.7103 9.77096 19.0981 9.89252C19.4878 10.0147 19.831 10.1903 20.1306 10.4176L20.1323 10.4189C20.4381 10.6478 20.7006 10.9249 20.9204 11.2514L20.9232 11.2554C21.1484 11.5796 21.3318 11.9491 21.472 12.3662Z'
									fill='#F0B90B'
								/>
								<path
									fillRule='evenodd'
									clipRule='evenodd'
									d='M7.69549 12.5917H5.35764L5.43059 12.1917C5.56459 11.4569 5.81011 10.7962 6.17037 10.2141C6.52734 9.63291 6.97204 9.13952 7.50332 8.73572C8.03289 8.32883 8.62598 8.02136 9.28029 7.81246C9.93067 7.60337 10.623 7.5 11.3555 7.5C12.5951 7.5 13.7096 7.79487 14.6898 8.39258C15.6699 8.9902 16.4391 9.83992 16.9965 10.9324C17.5569 12.031 17.8305 13.3221 17.8305 14.7941C17.8305 16.2662 17.5569 17.5573 16.9965 18.6558C16.4391 19.7484 15.6699 20.5981 14.6898 21.1957C13.7096 21.7934 12.5951 22.0883 11.3555 22.0883C10.6229 22.0883 9.93053 21.9849 9.28009 21.7757C8.62625 21.567 8.03347 21.262 7.50404 20.8597L7.5026 20.8586C6.97159 20.4505 6.527 19.9549 6.17005 19.3737C5.81032 18.7879 5.56475 18.1276 5.43066 17.3969L5.35718 16.9965H7.69496L7.7513 17.2603C7.84232 17.6865 8.00004 18.0582 8.22213 18.38L8.22268 18.3808C8.44469 18.7044 8.71573 18.978 9.03749 19.2025C9.35676 19.4241 9.71298 19.5926 10.1082 19.707C10.5052 19.8219 10.9207 19.8799 11.3555 19.8799C12.1461 19.8799 12.8538 19.6865 13.4863 19.304C14.1083 18.925 14.6097 18.3645 14.9883 17.6082C15.3578 16.8612 15.5508 15.928 15.5508 14.7941C15.5508 13.6603 15.3578 12.7271 14.9883 11.9801C14.6097 11.2238 14.1082 10.6632 13.4862 10.2843C12.8538 9.90178 12.1461 9.70839 11.3555 9.70839C10.9207 9.70839 10.5052 9.76635 10.1082 9.88128C9.71387 9.99542 9.35831 10.1657 9.03942 10.391L9.03556 10.3937C8.71478 10.6135 8.44437 10.8844 8.22269 11.2075L8.22103 11.2099C8.00014 11.526 7.84254 11.8967 7.75144 12.3273L7.69549 12.5917Z'
									fill='white'
								/>
								<path
									fillRule='evenodd'
									clipRule='evenodd'
									d='M21.472 12.3662L21.5479 12.5917H23.9141L23.836 12.188C23.7013 11.4914 23.4551 10.8541 23.0962 10.2791C22.7394 9.70292 22.2933 9.20852 21.7594 8.79699C21.2297 8.38073 20.628 8.06235 19.957 7.84023C19.2868 7.61244 18.568 7.5 17.8029 7.5C16.8713 7.5 16.0098 7.66789 15.2224 8.00849C14.4367 8.34836 13.7543 8.8385 13.1781 9.47775C12.6007 10.1184 12.1569 10.8908 11.8441 11.7891L11.8437 11.7901C11.5342 12.6879 11.3823 13.6907 11.3823 14.7941V15.1312H13.662V14.7941C13.662 13.66 13.8552 12.7265 14.2249 11.9794C14.5993 11.2227 15.0966 10.6622 15.7142 10.2835C16.3379 9.90119 17.0316 9.70839 17.8029 9.70839C18.2794 9.70839 18.7103 9.77096 19.0981 9.89252C19.4878 10.0147 19.831 10.1903 20.1306 10.4176L20.1323 10.4189C20.4381 10.6478 20.7006 10.9249 20.9204 11.2514L20.9232 11.2554C21.1484 11.5796 21.3318 11.9491 21.472 12.3662Z'
									fill='#F0B90B'
								/>
							</svg>
							<h1 className='text-2xl font-semibold ml-1'>
								CGate
							</h1>
						</div>
					</div>
					<div className='flex items-center gap-2'>
						<img src={logo} alt='' className='h-8 w-8' />
					</div>
					<button className=''>
						<ConnectButton></ConnectButton>
					</button>
				</div>
			</div>
			<div
				className={`bg-[#F5F6FE] md:w-60 w-[75%] h-screen border text-center lg:left-0 shadow-lg absolute z-10 ${
					state ? "block" : "hidden"
				}`}>
				<div className=''>
					<h1 className='text-2xl font-semibold text-left m-8 mb-4 hidden md:block '>
						CGate
					</h1>
				</div>
				<div className='flex mx-4 gap-3 mt-5 md:mt-0 items-center'>
					<img className='w-8 h-auto' src={cg8}></img>
					<h1 className=''>${parseFloat(cg8Price).toFixed(2)}</h1>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='20'
						height='20'
						viewBox='0 0 16 14'
						fill='green'>
						<path
							d='M0 12.9249C0 13.5723 0.401985 14 0.999529 14H14.4822C14.8516 14 15.1667 13.6763 15.1667 13.2717C15.1667 12.8787 14.8516 12.5434 14.4822 12.5434H1.4341C1.37978 12.5434 1.37978 12.5318 1.37978 12.4855V0.728321C1.37978 0.335257 1.06471 0 0.684453 0C0.315065 0 0 0.335257 0 0.728321V12.9249ZM1.11904 9.45662L4.11761 6.27748C4.22626 6.16182 4.3023 6.16182 4.40009 6.27748L6.98578 9.05199C7.31174 9.38725 7.63771 9.5492 8.00707 9.5492C8.38733 9.5492 8.73499 9.38725 9.02836 9.05199L11.8313 6.02308L12.9069 7.17919C13.222 7.50285 13.6783 7.32954 13.7978 6.84394L14.7539 2.60116C14.8734 2.16185 14.5039 1.79191 14.0803 1.90751L10.1039 2.90174C9.65849 3.01734 9.47381 3.53758 9.78887 3.84972L10.8535 4.98262L8.14836 7.90748C8.06136 8.02314 7.98537 8.02314 7.87668 7.91908L5.28007 5.10988C4.97591 4.77462 4.63915 4.61268 4.25884 4.61268C3.86773 4.61268 3.5418 4.77462 3.23759 5.10988L0.162961 8.41617L1.11904 9.45662Z'
							fill='green'
						/>
					</svg>
				</div>
				<nav className='space-y-2 mt-4  text-center mb-12 pl-4  text-sm text-gray-600 w-[90%]  '>
					{sidebarNavItems.map((item, index) => (
						<Link
							// onClick={handleClick}
							to={item.to}
							key={index}
							className={`flex items-center  py-2 px-2 transition-colors duration-200 rounded-xl ${
								location.pathname === item.to
									? "bg-white text-teal-600" // Active link style
									: "hover:bg-gray-200 bg-gray-10" // Inactive link style
							}`}
							onClick={handleClick}>
							<span className=''>{item.icon}</span>
							<span className='ml-3  '>{item.display}</span>{" "}
							{/* Add a span for the text */}
						</Link>
					))}
				</nav>

				<div className='self-stretch flex-1  rounded-xl overflow-hidden grid grid-col items-start py-2.5 pl-14 gap-[2px] text-left -ml-6  text-[14.2px]  text-gray-600'>
					<div className='self-stretch rounded  flex flex-row items-center justify-start gap-[4px] '>
						{/* <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src={globe}
            /> */}
           
						<Link
							to='/home'
							className='relative leading-[24px]  mb-1 flex gap-1'>
							<img
								className='relative w-6 h-6 overflow-hidden shrink-0'
								alt=''
								src={globe}
							/>
							Language
						</Link>
						<img
							className='relative w-[10.5px] h-1.5 mb-3'
							alt=''
							src='/vector2.svg'
						/>
					</div>
					<Link
						to='/home'
						className='self-stretch relative tracking-[-0.02em] leading-[24px] mb-1'>
						Whitepaper
					</Link>
					<Link
						to='/home'
						className='self-stretch relative tracking-[-0.02em] leading-[24px] mb-1'>
						Tutorials
					</Link>
					<Link
						to='/home'
						className='self-stretch relative tracking-[-0.02em] leading-[24px] mb-1'>
						Audit
					</Link>
					<Link
						to='/'
						className='self-stretch relative tracking-[-0.02em] leading-[24px] mb-1'>
						Contact us
					</Link>
					<Link
						to='/home'
						className='self-stretch relative tracking-[-0.02em] leading-[24px] mb-3'>
						We are hiring!
					</Link>

					<div className='flex flex-row items-center justify-start gap-[10px] '>
						<a href='/home'>
							<img
								className='relative w-6 h-6'
								alt=''
								src={vertor2}
							/>
						</a>
						<a href='/home'>
							<img
								className='relative w-6 h-6'
								alt=''
								src={twt}
							/>
						</a>
					</div>
				</div>
			</div>
		</div>
  );
};

export default SidebarMobile;
