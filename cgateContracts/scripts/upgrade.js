/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0x76337C72555fAcdB385D22234C0770175c72A9d5"; // Specify the address of your existing proxy contract
  const newImplementation = await ethers.getContractFactory("StakingPoolV3");

  // Upgrade the proxy contract
  const upgradedProxy = await upgrades.upgradeProxy(
    proxyAddress,
    newImplementation
  );
  console.log("Proxy contract upgraded:", upgradedProxy.address);

  // Verify the contract on etherscan
  await hre.run("verify:verify", {
    address: upgradedProxy.address,
    constructorArguments: [], // Update constructor arguments if necessary
  });
}

main();
