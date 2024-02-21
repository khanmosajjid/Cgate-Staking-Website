/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, CSSProperties, useRef, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
  useBalance,
} from "wagmi";
import { loginUser } from "../../utils/apiServices";
import { useNavigate } from "react-router-dom";
import ConnectorImage1 from "../../assets/1pic.svg";
import ConnectorImage2 from "../../assets/3pic.svg";
import ConnectorImage3 from "../../assets/4pic.svg";
import ConnectorImage4 from "../../assets/3pic.svg";
import BNBLogo from "../../assets/BNBSmart.png";

const modalStyle: CSSProperties = {
  // position: "fixed",
  // background: "white",
  // top: "50%",
  // left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 100,
  // backgroundColor: "white",
  // padding: "20px",
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
  // width: "600px",
  // height: "300px",
  maxHeight: "120vh",
  overflowY: "auto",
};

const closeButtonStyle: CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  border: "none",
  background: "none",
  cursor: "pointer",
  fontSize: "20px",
};

const overlayStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  zIndex: 100,
};

const connectorListStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  background: "white",
  gap: "10px",
  marginTop: "20px",
};

const connectorButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  cursor: "pointer",
  backgroundColor: "#f7f7f7",
};

const connectorImages = {
  0: ConnectorImage1,
  1: ConnectorImage2,
  2: ConnectorImage3,
  3: ConnectorImage4,

  // default: DefaultConnectorImage,
};

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}


const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <React.Fragment>
      <div style={overlayStyle} className="" />
      <div
        style={modalStyle}
        className="md:w-[600px] w-[90%] fixed bg-white top-[50%] left-[50%]  p-5 h-[300px] "
      >
        <div className="flex justify-between align-middle">
          <h1 className="text-[16px] leading-6">Connect your wallet</h1>
          <button style={closeButtonStyle} onClick={onClose} className="p-4">
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1 1L17 17"
                stroke="#475568"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        {/* <h1 className='py-5 pt-7 text-[16px] font-light'>
					Start by connecting one of the wallets.
				</h1> */}
        {children}
        <p className="mt-6 text-red-600 text-[14px] leading-5">
          Please install plugins in your browser in order to connect your wallet
          .
        </p>
      </div>
    </React.Fragment>
  );
};

export function ConnectWallet() {
  const navigate = useNavigate();
  const { chain, chains } = useNetwork();

  const { address, connector, isConnected } = useAccount();

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { data, isError } = useBalance({
    address: address,
  });
  const { disconnect } = useDisconnect();
  const [isModalOpen, setModalOpen] = useState(false);
  const settingsRef: any = useRef(null);

  const closeSettings = () => {
    setopenWallet(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        closeSettings();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDisconnectWallet = async () => {
    try {
      console.log("here");
      localStorage.removeItem("refAddress");
      disconnect();
      navigate("/dashboard");
    } catch (e) {
      console.log("error in disconnect is--->", e);
    }
  };

  const handleConnectWallet = async (connector) => {
    try {
      // Check if the connector is not supported on mobile
      if (isMobileDevice() && !connector.ready) {
        // Implement fallback logic here, e.g., display a message or use an alternative connector
        console.error("This connector is not supported on mobile devices.");
        return;
      }
      await connect({ connector });
    } catch (e) {
      console.log("Error in connecting wallet: ", e);
    }
  };
  

  const formatAddress = (address) => {
    if (address && address.length > 8) {
      return `${address.substring(0, 5)}...${address.substring(
        address.length - 5
      )}`;
    }
    return address;
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const [openWallet, setopenWallet] = useState(false);

  if (isConnected) {
    return (
      <>
        <div className="">
          <div className="flex">
            {/* <img src={ensAvatar} alt='Avatar' /> */}
            <button
              className="flex bg-teal-600 rounded-3xl p-2 px-3   text-white"
              onClick={() => {
                setopenWallet(!openWallet);
              }}
            >
              Wallet: &nbsp; {formatAddress(address)}
            </button>
          </div>
          {/* <div>Connected to {connector?.name}</div> */}
          {/* <button onClick={handleDisconnectWallet}>Disconnect</button> */}
        </div>
        {openWallet ? (
          <div
            ref={settingsRef}
            className={`absolute z-100 bg-white md:top-12 top-16 md:w-[25%] right-4 p-4 border shadow-2xl rounded-2xl transition-all `}
          >
            <div className="flex justify-between mb-5">
              <h1 className="font-[500px]">Wallet details</h1>
              <button onClick={() => setopenWallet(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M17 1L1 17"
                    stroke="#475568"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M1 1L17 17"
                    stroke="#475568"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <h1 className="text-gray-800 text-left">Balance</h1>
            <div className="flex items-center gap-3 py-3">
              <img src={BNBLogo} alt="" />
              <p className="text-center ">
                {data?.formatted} {data?.symbol}
              </p>
            </div>

            <h1 className="text-sm">
              Wallet address: {formatAddress(address)}
            </h1>
            <div className="py-5">
              <hr />
            </div>

            <div className="flex gap-6">
              <button
                className="bg-teal-600 px-3 p-2 w-full text-white rounded-3xl cursor-pointer z-100"
                onClick={handleDisconnectWallet}
              >
                Disconnect wallet
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    );
  }

  return (
    <div>
      <div className="md:flex flex-row items-center justify-end gap-[16px] text-sm hidde">
        <div className="rounded-2xl bg-teal-600 text-white flex flex-row items-center justify-center py-3 px-4 w-full  gap-[10px]   ">
          <button className="w-full" onClick={handleOpenModal}>
            Connect wallet
          </button>
        </div>
        <div></div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div style={connectorListStyle}>
          {connectors.map((connector, index) => (
            <button
            style={connectorButtonStyle}
            disabled={!connector.ready} // Disable button if connector is not ready
            key={connector.id}
            onClick={() => {
              if (connector.ready) {
                handleConnectWallet(connector);
                handleCloseModal();
              } else {
                // Optionally, inform the user why the connector is disabled
                console.error("This connector is currently unsupported.");
              }
            }}
          >
            <img src={connectorImages[index] || connectorImages[index]} alt={`Connect with ${connector.name}`} />
            {connector.name}{!connector.ready && " (unsupported)"}
            {isLoading && connector.id === pendingConnector?.id && " (connecting)"}
          </button>
          ))}
        </div>
        {error && <div>{error?.message}</div>}
      </Modal>
    </div>
  );
}
