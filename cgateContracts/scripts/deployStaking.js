const { ethers, upgrades } = require("hardhat");

async function main() {

  const StakingPool = await ethers.getContractFactory("StakingPoolV3");
   let _initialVoters = [
     "0x82e5B489661F4041A5cA426953eb24858EBC3aB6",
     "0x9B7C50300b6CBCAfbc2A58d4d1410176B1d6250c",
   ];
  const proxy = await upgrades.deployProxy(StakingPool, [_initialVoters], { gasLimit: "90000000" });
  await proxy.deployed();

  console.log("Staking contract:", proxy.address);
  await hre.run("verify:verify", {
    address: proxy.address,
    constructorArguments: []
  });
}

main();