const { ethers, upgrades } = require("hardhat");

async function main() {

    await hre.run("verify:verify", {
        address: "0xe00a1fd596ea60cb6dbcfeb954d652123c9024fd",
        constructorArguments: []
      address: "0xaf310993394e27bbe3c569cb6c9caf98e64bd700",
      constructorArguments: [],
    });
}

// Call the main function and catch if there is any error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });