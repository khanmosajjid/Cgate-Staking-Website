const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0xcf28Bd157c43fEA7CfDc5B8E2B480e1CF9aC66dA"; // Specify the address of your existing proxy contract
  const newImplementation = await ethers.getContractFactory("CG8");

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
