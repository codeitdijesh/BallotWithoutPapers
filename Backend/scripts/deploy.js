const hre = require("hardhat");

async function main() {
  console.log("\n🗳️  Deploying Election Contract...\n");

  // Election configuration
  const electionName = "General Election 2026";
  const candidates = [
    "Alice Johnson",
    "Bob Smith",
    "Carol Williams"
  ];

  console.log("Election Name:", electionName);
  console.log("Candidates:", candidates.join(", "));
  console.log("");

  // Deploy the contract
  const Election = await hre.ethers.getContractFactory("Election");
  const election = await Election.deploy(electionName, candidates);

  await election.waitForDeployment();

  const address = await election.getAddress();
  console.log("✅ Election contract deployed to:", address);
  console.log("");

  // Display deployment info
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deployment Info:");
  console.log("   Deployer:", deployer.address);
  console.log("   Network:", hre.network.name);
  console.log("   Contract Address:", address);
  console.log("");

  // Verify initial state
  const phase = await election.getCurrentPhase();
  const candidateCount = await election.getCandidateCount();
  const stats = await election.getStats();

  console.log("🔍 Initial State:");
  console.log("   Phase:", phase);
  console.log("   Candidates:", candidateCount.toString());
  console.log("   Eligible Voters:", stats.eligible.toString());
  console.log("");

  console.log("💡 Next Steps:");
  console.log("   1. Add voters: node scripts/addVoters.js");
  console.log("   2. Start commit phase");
  console.log("   3. Voters commit votes");
  console.log("   4. Start reveal phase");
  console.log("   5. Voters reveal votes");
  console.log("   6. End election and view results");
  console.log("");

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: address,
    electionName: electionName,
    candidates: candidates,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("📄 Deployment info saved to deployment.json");
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
