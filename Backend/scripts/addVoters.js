const hre = require("hardhat");
const fs = require("fs");

/**
 * Script to manually add voters to the election contract
 * Usage: node scripts/addVoters.js
 */

async function main() {
  console.log("\n👥 Adding Voters to Election...\n");

  // Load deployment info
  if (!fs.existsSync("deployment.json")) {
    console.error("❌ deployment.json not found. Please deploy the contract first.");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 Network:", hre.network.name);
  console.log("");

  // Get contract instance
  const Election = await hre.ethers.getContractFactory("Election");
  const election = Election.attach(contractAddress);

  // Get some test accounts
  const [deployer, voter1, voter2, voter3, voter4, voter5] = await hre.ethers.getSigners();

  console.log("🔑 Available Test Accounts:");
  console.log("   Deployer (Admin):", deployer.address);
  console.log("   Voter 1:", voter1.address);
  console.log("   Voter 2:", voter2.address);
  console.log("   Voter 3:", voter3.address);
  console.log("   Voter 4:", voter4.address);
  console.log("   Voter 5:", voter5.address);
  console.log("");

  // ============ Option 1: Add voters one by one ============
  
  console.log("📝 Adding voters individually...");
  
  try {
    const tx1 = await election.addVoter(voter1.address);
    await tx1.wait();
    console.log("   ✅ Added:", voter1.address);

    const tx2 = await election.addVoter(voter2.address);
    await tx2.wait();
    console.log("   ✅ Added:", voter2.address);

    const tx3 = await election.addVoter(voter3.address);
    await tx3.wait();
    console.log("   ✅ Added:", voter3.address);

  } catch (error) {
    console.error("   ❌ Error adding voters individually:", error.message);
  }

  console.log("");

  // ============ Option 2: Add voters in batch (more gas efficient) ============
  
  console.log("📦 Adding voters in batch...");
  
  try {
    const voterAddresses = [voter4.address, voter5.address];
    const txBatch = await election.addVotersBatch(voterAddresses);
    await txBatch.wait();
    console.log("   ✅ Batch added:", voterAddresses.length, "voters");
  } catch (error) {
    console.error("   ❌ Error adding batch:", error.message);
  }

  console.log("");

  // ============ Verify voters were added ============
  
  console.log("🔍 Verifying voters...");
  
  const allVoters = [voter1, voter2, voter3, voter4, voter5];
  
  for (const voter of allVoters) {
    const isEligible = await election.isEligible(voter.address);
    const status = isEligible ? "✅ Eligible" : "❌ Not Eligible";
    console.log(`   ${status}: ${voter.address}`);
  }

  console.log("");

  // Get election stats
  const stats = await election.getStats();
  console.log("📊 Election Stats:");
  console.log("   Total Eligible Voters:", stats.eligible.toString());
  console.log("   Current Phase:", stats.phase);
  console.log("");

  console.log("💡 Next Steps:");
  console.log("   1. Add more voters if needed (run this script again)");
  console.log("   2. Start commit phase: node scripts/startCommitPhase.js");
  console.log("   3. Test voting: node scripts/testVoting.js");
  console.log("");

  // Save voter list for testing
  const voterList = {
    contractAddress: contractAddress,
    voters: allVoters.map(v => ({
      address: v.address,
      // In a real scenario, you'd securely store these or use a wallet
    })),
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    "voters.json",
    JSON.stringify(voterList, null, 2)
  );
  console.log("📄 Voter list saved to voters.json");
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
