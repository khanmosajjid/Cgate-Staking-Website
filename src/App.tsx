
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/sidebar/sidebar"; 
// import React from "react";
import { ClickToComponent } from "click-to-react-component";
// import Frame from "./components/Dash/Home";
// import Swapcomp from './components/swap/Swap';
// import CardSwap from './components/CardSwap/CardSwap';
// import Swapcomp from './components/Dashboard/Swap';
// import WalletDetails from './components/Dashboard/WalletDetails';
// import HistoricalPrice from './components/Dashboard/HistoricalPrice';
import Dashboard from "./components/Dashboard/Dashboard";
import Swap from "./components/swap/Swap";
import Deposit from "./components/Deposite/Deposite";
import Referral from "./components/Referral/Referral";
import SidebarMobile from "./components/sidebar/SidebarMobile";
import Home from "./components/Home/Home";
import bg from './assets/Master-bg.jpg'





function App() {
	
	return (
    <>
      
        <ClickToComponent />
        <div className="fixed -z-10 overflow-hidden ">
          <img className=" w-full h-screen md:h-auto" src={bg} alt="" />
        </div>
        <div className="md:flex  ">
          <div className="md:flex hidden">
            <Layout />
          </div>
          <div className="md:hidden">
            <SidebarMobile />
          </div>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/referral" element={<Referral/>} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
    
    </>
  );
}

export default App;
