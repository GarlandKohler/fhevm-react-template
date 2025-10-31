const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n==================================================");
  console.log("  Confidential Futures Trading Platform Deployment");
  console.log("==================================================\n");

  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("Deployment Information:");
  console.log("- Network:", network);
  console.log("- Deployer address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("- Deployer balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("\n--------------------------------------------------\n");

  // Deploy the ConfidentialFuturesTrading contract
  console.log("Deploying ConfidentialFuturesTrading contract...");

  const ConfidentialFuturesTrading = await hre.ethers.getContractFactory("ConfidentialFuturesTrading");

  console.log("- Estimating deployment gas...");
  const deploymentData = ConfidentialFuturesTrading.getDeployTransaction();

  const contract = await ConfidentialFuturesTrading.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("\n✅ Contract deployed successfully!");
  console.log("- Contract address:", contractAddress);
  console.log("- Transaction hash:", contract.deploymentTransaction().hash);
  console.log("- Block number:", contract.deploymentTransaction().blockNumber);

  // Wait for additional confirmations
  if (network !== "hardhat" && network !== "localhost") {
    console.log("\n⏳ Waiting for 5 block confirmations...");
    await contract.deploymentTransaction().wait(5);
    console.log("✅ Confirmed!");
  }

  // Save deployment information
  const deploymentInfo = {
    network: network,
    contractName: "ConfidentialFuturesTrading",
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTransaction: contract.deploymentTransaction().hash,
    blockNumber: contract.deploymentTransaction().blockNumber,
    timestamp: new Date().toISOString(),
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // Save deployment info to file
  const deploymentFile = path.join(deploymentsDir, `${network}-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n📁 Deployment information saved to:", deploymentFile);

  // Display useful links
  if (network === "sepolia") {
    console.log("\n==================================================");
    console.log("  Blockchain Explorer Links");
    console.log("==================================================");
    console.log("\n📊 View on Etherscan:");
    console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
    console.log("\n📝 Verify contract:");
    console.log(`   npx hardhat verify --network sepolia ${contractAddress}`);
  }

  console.log("\n==================================================");
  console.log("  Next Steps");
  console.log("==================================================");
  console.log("\n1. Verify the contract on Etherscan:");
  console.log("   npm run verify");
  console.log("\n2. Interact with the contract:");
  console.log("   npm run interact");
  console.log("\n3. Run simulation tests:");
  console.log("   npm run simulate");
  console.log("\n==================================================\n");

  return { contract, contractAddress, deployer };
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

module.exports = main;
