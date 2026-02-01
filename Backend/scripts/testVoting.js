const hre = require("hardhat");
const fs = require("fs");

/**
 * Complete voting simulation script
 * Tests the entire commit-reveal voting process
 */

async function main() {
  console.log("\n🗳️  Testing Complete Voting Flow...\n");

  // Load deployment info
  if (!fs.existsSync("deployment.json")) {
    console.error("❌ deployment.json not found.");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  const Election = await hre.ethers.getContractFactory("Election");
  const election = Election.attach(contractAddress);

  const [deployer, voter1, voter2, voter3] = await hre.ethers.getSigners();

  console.log("📍 Contract:", contractAddress);
  console.log("🌐 Network:", hre.network.name);
  console.log("");

  // ============ Phase 1: Start Commit Phase ============
  console.log("📢 PHASE 1: Starting Commit Phase...");
  
  try {
    const tx = await election.startCommitPhase();
    await tx.wait();
    console.log("   ✅ Commit phase started");
  } catch (error) {
    console.log("   ⚠️  Commit phase already started or error:", error.message);
  }
  console.log("");

  // ============ Phase 2: Voters Commit Votes ============
  console.log("📝 PHASE 2: Committing Votes...");
  console.log("");

  // Helper function to create commitment hash
  function createCommitment(candidateId, salt) {
    return hre.ethers.solidityPackedKeccak256(
      ["uint256", "bytes32"],
      [candidateId, salt]
    );
  }

  // Voter 1: Votes for candidate 0 (Alice)
  const voter1Salt = hre.ethers.randomBytes(32);
  const voter1Commitment = createCommitment(0, voter1Salt);
  
  console.log("🗳️  Voter 1 commits vote...");
  console.log("   Address:", voter1.address);
  console.log("   Voting for: Candidate 0 (Alice)");
  console.log("   Salt:", hre.ethers.hexlify(voter1Salt));
  console.log("   Commitment:", voter1Commitment);
  
  try {
    const tx1 = await election.connect(voter1).commitVote(voter1Commitment);
    await tx1.wait();
    console.log("   ✅ Vote committed");
  } catch (error) {
    console.log("   ❌ Error:", error.message);
  }
  console.log("");

  // Voter 2: Votes for candidate 1 (Bob)
  const voter2Salt = hre.ethers.randomBytes(32);
  const voter2Commitment = createCommitment(1, voter2Salt);
  
  console.log("🗳️  Voter 2 commits vote...");
  console.log("   Address:", voter2.address);
  console.log("   Voting for: Candidate 1 (Bob)");
  console.log("   Salt:", hre.ethers.hexlify(voter2Salt));
  console.log("   Commitment:", voter2Commitment);
  
  try {
    const tx2 = await election.connect(voter2).commitVote(voter2Commitment);
    await tx2.wait();
    console.log("   ✅ Vote committed");
  } catch (error) {
    console.log("   ❌ Error:", error.message);
  }
  console.log("");

  // Voter 3: Votes for candidate 0 (Alice)
  const voter3Salt = hre.ethers.randomBytes(32);
  const voter3Commitment = createCommitment(0, voter3Salt);
  
  console.log("🗳️  Voter 3 commits vote...");
  console.log("   Address:", voter3.address);
  console.log("   Voting for: Candidate 0 (Alice)");
  console.log("   Salt:", hre.ethers.hexlify(voter3Salt));
  console.log("   Commitment:", voter3Commitment);
  
  try {
    const tx3 = await election.connect(voter3).commitVote(voter3Commitment);
    await tx3.wait();
    console.log("   ✅ Vote committed");
  } catch (error) {
    console.log("   ❌ Error:", error.message);
  }
  console.log("");

  // Check stats after commits
  let stats = await election.getStats();
  console.log("📊 After Commit Phase:");
  console.log("   Eligible Voters:", stats.eligible.toString());
  console.log("   Committed Votes:", stats.committed.toString());
  console.log("   Current Phase:", stats.phase);
  console.log("");

  // ============ Phase 3: Start Reveal Phase ============
  console.log("📢 PHASE 3: Starting Reveal Phase...");
  
  try {
    const tx = await election.startRevealPhase();
    await tx.wait();
    console.log("   ✅ Reveal phase started");
  } catch (error) {
    console.log("   ⚠️  Reveal phase already started or error:", error.message);
  }
  console.log("");

  // ============ Phase 4: Voters Reveal Votes ============
  console.log("🔓 PHASE 4: Revealing Votes...");
  console.log("");

  // Voter 1 reveals
  console.log("🔓 Voter 1 reveals...");
  try {
    const tx1 = await election.connect(voter1).revealVote(0, voter1Salt);
    await tx1.wait();
    console.log("   ✅ Vote revealed: Candidate 0 (Alice)");
  } catch (error) {
    console.log("   ❌ Error:", error.message);
  }
  console.log("");

  // Voter 2 reveals
  console.log("🔓 Voter 2 reveals...");
  try {
    const tx2 = await election.connect(voter2).revealVote(1, voter2Salt);
    await tx2.wait();
    console.log("   ✅ Vote revealed: Candidate 1 (Bob)");
  } catch (error) {
    console.log("   ❌ Error:", error.message);
  }
  console.log("");

  // Voter 3 reveals
  console.log("🔓 Voter 3 reveals...");
  try {
    const tx3 = await election.connect(voter3).revealVote(0, voter3Salt);
    await tx3.wait();
    console.log("   ✅ Vote revealed: Candidate 0 (Alice)");
  } catch (error) {
    console.log("   ❌ Error:", error.message);
  }
  console.log("");

  // Check stats after reveals
  stats = await election.getStats();
  console.log("📊 After Reveal Phase:");
  console.log("   Committed Votes:", stats.committed.toString());
  console.log("   Revealed Votes:", stats.revealed.toString());
  console.log("   Current Phase:", stats.phase);
  console.log("");

  // ============ Phase 5: End Election ============
  console.log("📢 PHASE 5: Ending Election...");
  
  try {
    const tx = await election.endElection();
    await tx.wait();
    console.log("   ✅ Election ended");
  } catch (error) {
    console.log("   ⚠️  Election already ended or error:", error.message);
  }
  console.log("");

  // ============ View Results ============
  console.log("🏆 FINAL RESULTS:");
  console.log("═".repeat(50));
  
  const results = await election.getResults();
  let totalVotes = 0n;
  
  for (const candidate of results) {
    totalVotes += candidate.voteCount;
    const percentage = stats.revealed > 0n 
      ? ((candidate.voteCount * 100n) / stats.revealed).toString()
      : "0";
    
    console.log(`   ${candidate.name}:`);
    console.log(`      Votes: ${candidate.voteCount.toString()}`);
    console.log(`      Percentage: ${percentage}%`);
    console.log("");
  }
  
  console.log("═".repeat(50));
  console.log(`   Total Votes Cast: ${totalVotes.toString()}`);
  console.log("");

  // Get winner
  const winner = await election.getWinner();
  console.log("🥇 WINNER:");
  console.log(`   ${winner.winnerName}`);
  console.log(`   Votes: ${winner.winnerVotes.toString()}`);
  console.log("");

  console.log("✅ Voting test completed successfully!");
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
