/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import globe from "../../assets/globe.svg"; // Import your icon
import twt from "../../assets/twt.svg"; // Import your icon
import vertor2 from "../../assets/Vector2.svg"; // Import
import {getAmountOut,getMinAmountIn } from "../../utils/web3Utils.js";
import { TOKEN_CONTRACT,USDC_CONTRACT } from "../../constants/contracts.js";
import cg8 from "../../assets/CG8.svg";
const Sidebar = () => {
  // const [state, setState] = useState(true);
  const location = useLocation(); // Added line
  const [cg8Price, setCg8Price] = useState<any>();

  useEffect(() => {
    const getCG8Balance = async () => {
       let price: any = await getMinAmountIn("1");
       price = parseFloat(price).toFixed(2);
       setCg8Price(price);;
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
  // console.log(colorhome);

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
      display: "Referral",
      to: "/referral",
    },
  ];

  return (
    <div className="w-[100%]">
      <div
        className={`bg-gray-50 md:w-60 w-[80%] border h-screen fixed text-center lg:left-0 shadow-lg`}
      >
        <div className="">
          <h1 className="text-2xl font-semibold text-left m-8 mb-4 hidden md:block ">
            CGate
          </h1>
        </div>
        <div className="flex mx-8 gap-3 mt-16 md:mt-0">
          <img className="w-6 h-auto" src={cg8}></img>
          <h1 className="text-sm">${parseFloat(cg8Price).toFixed(2)}</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="18"
            viewBox="0 0 16 14"
            fill="none"
          >
            <path
              d="M0 12.9249C0 13.5723 0.401985 14 0.999529 14H14.4822C14.8516 14 15.1667 13.6763 15.1667 13.2717C15.1667 12.8787 14.8516 12.5434 14.4822 12.5434H1.4341C1.37978 12.5434 1.37978 12.5318 1.37978 12.4855V0.728321C1.37978 0.335257 1.06471 0 0.684453 0C0.315065 0 0 0.335257 0 0.728321V12.9249ZM1.11904 9.45662L4.11761 6.27748C4.22626 6.16182 4.3023 6.16182 4.40009 6.27748L6.98578 9.05199C7.31174 9.38725 7.63771 9.5492 8.00707 9.5492C8.38733 9.5492 8.73499 9.38725 9.02836 9.05199L11.8313 6.02308L12.9069 7.17919C13.222 7.50285 13.6783 7.32954 13.7978 6.84394L14.7539 2.60116C14.8734 2.16185 14.5039 1.79191 14.0803 1.90751L10.1039 2.90174C9.65849 3.01734 9.47381 3.53758 9.78887 3.84972L10.8535 4.98262L8.14836 7.90748C8.06136 8.02314 7.98537 8.02314 7.87668 7.91908L5.28007 5.10988C4.97591 4.77462 4.63915 4.61268 4.25884 4.61268C3.86773 4.61268 3.5418 4.77462 3.23759 5.10988L0.162961 8.41617L1.11904 9.45662Z"
              fill="#2563EB"
            />
          </svg>
        </div>
        <nav className="space-y-2 mt-4 text-center mb-32 text-sm font-light w-[80%] mx-auto">
          {sidebarNavItems.map((item, index) => (
            <Link
              // onClick={handleClick}
              to={item.to}
              key={index}
              className={`flex items-center px-5 py-2 transition-colors duration-200 rounded-xl ${
                location.pathname === item.to
                  ? "bg-blue-100 text-teal-600" // Active link style
                  : "hover:bg-gray-200 bg-gray-100" // Inactive link style
              }`}
            >
              <span className="">{item.icon}</span>
              <span className="ml-3 ">{item.display}</span>{" "}
              {/* Add a span for the text */}
            </Link>
          ))}
        </nav>

        <div className="self-stretch flex-1 rounded-xl overflow-hidden flex flex-col items-start py-2.5 px-0 gap-[12px] text-left ml-10 font-light ">
          <div className="self-stretch rounded bg-basic-white flex flex-row items-center justify-start gap-[10px] text-sm ">
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src={globe}
            />
            <Link to="/home" className="relative leading-[20px] font-medium">
              Language
            </Link>
            <img
              className="relative w-[10.5px] h-1.5"
              alt=""
              src="/vector2.svg"
            />
          </div>
          <Link
            to="/home"
            className="self-stretch relative tracking-[-0.02em] leading-[24px]"
          >
            Whitepaper
          </Link>
          <Link
            to="/home"
            className="self-stretch relative tracking-[-0.02em] leading-[24px]"
          >
            Tutorials
          </Link>
          <Link
            to="/home"
            className="self-stretch relative tracking-[-0.02em] leading-[24px]"
          >
            Audit
          </Link>
          <Link
            to="/"
            className="self-stretch relative tracking-[-0.02em] leading-[24px]"
          >
            Contact us
          </Link>
          <Link
            to="/home"
            className="self-stretch relative tracking-[-0.02em] leading-[24px]"
          >
            We are hiring!
          </Link>

          <div className="flex flex-row items-center justify-start gap-[10px]">
            <a href="/home">
              <img className="relative w-6 h-6" alt="" src={vertor2} />
            </a>
            <a href="/home">
              <img className="relative w-6 h-6" alt="" src={twt} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Layout = () => {
  return (
    <div className="flex  ">
      <Sidebar />
      <div className="md:flex md:flex-grow lg:p-4  hidden ">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
