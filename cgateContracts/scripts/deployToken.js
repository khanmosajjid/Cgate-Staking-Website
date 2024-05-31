const { ethers, upgrades } = require("hardhat");


async function main() {
  let _initialVoters = [
    "0x82e5B489661F4041A5cA426953eb24858EBC3aB6",
    "0xAcf965169b86829D755C99eA3A0670102b4F9B59",
  ];
    const arguments = [
      "CGate",
      "CG8",
      18,
      10000,
      "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3",
      _initialVoters
       ];

    const Cgate = await ethers.getContractFactory("CG8");
    const proxy = await upgrades.deployProxy(Cgate, arguments, { gasLimit: "90000000" });
    await proxy.deployed();

    console.log("Cgate token:", proxy.address);

    await hre.run("verify:verify", {
        address: proxy.address,
        constructorArguments: []
    });
}

main();