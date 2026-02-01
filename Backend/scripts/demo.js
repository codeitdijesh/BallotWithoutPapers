const hre = require("hardhat");

/**
 * Complete end-to-end test of the voting system
 * Deploys, configures, and runs a full election
 */

async function main() {
  console.log("\n🗳️  COMPLETE VOTING SYSTEM TEST\n");
  console.log("=".repeat(60));

  // Get signers
  const [admin, voter1, voter2, voter3, voter4, voter5] = await hre.ethers.getSigners();

  console.log("\n👥 Participants:");
  console.log("   Admin:", admin.address);
  console.log("   Voter 1:", voter1.address);
  console.log("   Voter 2:", voter2.address);
  console.log("   Voter 3:", voter3.address);
  console.log("   Voter 4:", voter4.address);
  console.log("   Voter 5:", voter5.address);

  // ============ 1. DEPLOY CONTRACT ============
  console.log("\n" + "=".repeat(60));
  console.log("STEP 1: DEPLOYING CONTRACT");
  console.log("=".repeat(60));

  const electionName = "2026 General Election";
  const candidates = ["Alice Johnson", "Bob Smith", "Carol Williams"];

  const Election = await hre.ethers.getContractFactory("Election");
  const election = await Election.deploy(electionName, candidates);
  await election.waitForDeployment();

  const address = await election.getAddress();
  console.log("✅ Contract deployed to:", address);
  console.log("   Election:", electionName);
  console.log("   Candidates:", candidates.join(", "));

  // ============ 2. ADD VOTERS ============
  console.log("\n" + "=".repeat(60));
  console.log("STEP 2: ADDING VOTERS (Registration Phase)");
  console.log("=".repeat(60));

  // Add voters in batch
  const voters = [voter1.address, voter2.address, voter3.address, voter4.address, voter5.address];
  const tx = await election.addVotersBatch(voters);
  await tx.wait();

  console.log("✅ Added 5 voters in batch");
  
  for (let i = 0; i < voters.length; i++) {
    const isEligible = await election.isEligible(voters[i]);
    console.log(`   Voter ${i + 1}: ${voters[i].slice(0, 10)}... - ${isEligible ? "✅ Eligible" : "❌ Not Eligible"}`);
  }

  let stats = await election.getStats();
  console.log("\n📊 Stats:", stats.eligible.toString(), "eligible voters");

  // ============ 3. START COMMIT PHASE ============
  console.log("\n" + "=".repeat(60));
  console.log("STEP 3: START COMMIT PHASE");
  console.log("=".repeat(60));

  await election.startCommitPhase();
  console.log("✅ Voting has begun!");
  console.log("   Phase:", await election.getCurrentPhase());

  // ============ 4. VOTERS COMMIT VOTES ============
  console.log("\n" + "=".repeat(60));
  console.log("STEP 4: VOTERS COMMIT THEIR VOTES");
  console.log("=".repeat(60));

  // Helper function to create commitment
  function createCommitment(candidateId, salt) {
    return hre.ethers.solidityPackedKeccak256(
      ["uint256", "bytes32"],
      [candidateId, salt]
    );
  }

  // Store salts for reveal phase
  const voteData = [];

  // Voter 1 votes for Alice (0)
  console.log("\n🗳️  Voter 1 (Alice):");
  const salt1 = hre.ethers.randomBytes(32);
  const commit1 = createCommitment(0, salt1);
  await election.connect(voter1).commitVote(commit1);
  voteData.push({ voter: voter1, candidateId: 0, salt: salt1, name: "Alice Johnson" });
  console.log("   ✅ Vote committed");

  // Voter 2 votes for Bob (1)
  console.log("\n🗳️  Voter 2 (Bob):");
  const salt2 = hre.ethers.randomBytes(32);
  const commit2 = createCommitment(1, salt2);
  await election.connect(voter2).commitVote(commit2);
  voteData.push({ voter: voter2, candidateId: 1, salt: salt2, name: "Bob Smith" });
  console.log("   ✅ Vote committed");

  // Voter 3 votes for Alice (0)
  console.log("\n🗳️  Voter 3 (Alice):");
  const salt3 = hre.ethers.randomBytes(32);
  const commit3 = createCommitment(0, salt3);
  await election.connect(voter3).commitVote(commit3);
  voteData.push({ voter: voter3, candidateId: 0, salt: salt3, name: "Alice Johnson" });
  console.log("   ✅ Vote committed");

  // Voter 4 votes for Carol (2)
  console.log("\n🗳️  Voter 4 (Carol):");
  const salt4 = hre.ethers.randomBytes(32);
  const commit4 = createCommitment(2, salt4);
  await election.connect(voter4).commitVote(commit4);
  voteData.push({ voter: voter4, candidateId: 2, salt: salt4, name: "Carol Williams" });
  console.log("   ✅ Vote committed");

  // Voter 5 votes for Alice (0)
  console.log("\n🗳️  Voter 5 (Alice):");
  const salt5 = hre.ethers.randomBytes(32);
  const commit5 = createCommitment(0, salt5);
  await election.connect(voter5).commitVote(commit5);
  voteData.push({ voter: voter5, candidateId: 0, salt: salt5, name: "Alice Johnson" });
  console.log("   ✅ Vote committed");

  stats = await election.getStats();
  console.log("\n📊 Commit Phase Complete:");
  console.log("   Eligible:", stats.eligible.toString());
  console.log("   Committed:", stats.committed.toString());

  // ============ 5. START REVEAL PHASE ============
  console.log("\n" + "=".repeat(60));
  console.log("STEP 5: START REVEAL PHASE");
  console.log("=".repeat(60));

  await election.startRevealPhase();
  console.log("✅ Reveal phase started");
  console.log("   Voters can now reveal their votes");
  console.log("   Phase:", await election.getCurrentPhase());

  // ============ 6. VOTERS REVEAL VOTES ============
  console.log("\n" + "=".repeat(60));
  console.log("STEP 6: VOTERS REVEAL THEIR VOTES");
  console.log("=".repeat(60));

  for (let i = 0; i < voteData.length; i++) {
    const data = voteData[i];
    console.log(`\n🔓 Voter ${i + 1} reveals vote for ${data.name}:`);
    await election.connect(data.voter).revealVote(data.candidateId, data.salt);
    console.log("   ✅ Vote revealed and counted");
  }

  stats = await election.getStats();
  console.log("\n📊 Reveal Phase Complete:");
  console.log("   Committed:", stats.committed.toString());
  console.log("   Revealed:", stats.revealed.toString());

  // ============ 7. END ELECTION ============
  console.log("\n" + "=".repeat(60));
  console.log("STEP 7: END ELECTION");
  console.log("=".repeat(60));

  await election.endElection();
  console.log("✅ Election ended");
  console.log("   Final Phase:", await election.getCurrentPhase());

  // ============ 8. VIEW RESULTS ============
  console.log("\n" + "=".repeat(60));
  console.log("STEP 8: FINAL RESULTS");
  console.log("=".repeat(60));

  const results = await election.getResults();
  
  console.log("\n🏆 ELECTION RESULTS:\n");
  
  let totalVotes = 0n;
  for (const candidate of results) {
    totalVotes += candidate.voteCount;
    const percentage = stats.revealed > 0n 
      ? Number((candidate.voteCount * 100n) / stats.revealed)
      : 0;
    
    const bar = "█".repeat(Number(candidate.voteCount));
    
    console.log(`   ${candidate.name}:`);
    console.log(`      ${bar} ${candidate.voteCount.toString()} votes (${percentage}%)`);
    console.log("");
  }

  console.log("─".repeat(60));
  console.log(`   Total Votes: ${totalVotes.toString()}`);
  console.log(`   Turnout: ${stats.revealed.toString()}/${stats.eligible.toString()} (${Number((stats.revealed * 100n) / stats.eligible)}%)`);
  console.log("─".repeat(60));

  // Get winner
  const winner = await election.getWinner();
  console.log("\n🥇 WINNER:");
  console.log(`   ${winner.winnerName}`);
  console.log(`   with ${winner.winnerVotes.toString()} votes`);

  console.log("\n" + "=".repeat(60));
  console.log("✅ END-TO-END TEST COMPLETED SUCCESSFULLY!");
  console.log("=".repeat(60));
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
