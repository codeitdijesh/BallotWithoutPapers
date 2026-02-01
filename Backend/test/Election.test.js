const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Election Contract", function () {
  let Election;
  let election;
  let owner;
  let voter1, voter2, voter3, voter4;
  let addrs;

  const electionName = "Test Election 2026";
  const candidates = ["Alice", "Bob", "Carol"];

  beforeEach(async function () {
    // Get signers
    [owner, voter1, voter2, voter3, voter4, ...addrs] = await ethers.getSigners();

    // Deploy contract
    Election = await ethers.getContractFactory("Election");
    election = await Election.deploy(electionName, candidates);
    await election.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct election name", async function () {
      expect(await election.electionName()).to.equal(electionName);
    });

    it("Should initialize with correct number of candidates", async function () {
      expect(await election.getCandidateCount()).to.equal(candidates.length);
    });

    it("Should set the deployer as owner", async function () {
      expect(await election.owner()).to.equal(owner.address);
    });

    it("Should start in Registration phase", async function () {
      expect(await election.getCurrentPhase()).to.equal("Registration");
    });

    it("Should have zero eligible voters initially", async function () {
      const stats = await election.getStats();
      expect(stats.eligible).to.equal(0);
    });

    it("Should revert with less than 2 candidates", async function () {
      await expect(
        Election.deploy("Bad Election", ["Only One"])
      ).to.be.revertedWith("Need at least 2 candidates");
    });

    it("Should revert with empty election name", async function () {
      await expect(
        Election.deploy("", candidates)
      ).to.be.revertedWith("Election name required");
    });
  });

  describe("Voter Management", function () {
    it("Should allow owner to add a voter", async function () {
      await election.addVoter(voter1.address);
      expect(await election.isEligible(voter1.address)).to.be.true;
      expect(await election.totalEligibleVoters()).to.equal(1);
    });

    it("Should emit VoterAdded event", async function () {
      await expect(election.addVoter(voter1.address))
        .to.emit(election, "VoterAdded")
        .withArgs(voter1.address);
    });

    it("Should not allow adding same voter twice", async function () {
      await election.addVoter(voter1.address);
      await expect(
        election.addVoter(voter1.address)
      ).to.be.revertedWith("Already registered");
    });

    it("Should not allow adding zero address", async function () {
      await expect(
        election.addVoter(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid address");
    });

    it("Should allow batch adding voters", async function () {
      const voters = [voter1.address, voter2.address, voter3.address];
      await election.addVotersBatch(voters);
      
      expect(await election.totalEligibleVoters()).to.equal(3);
      expect(await election.isEligible(voter1.address)).to.be.true;
      expect(await election.isEligible(voter2.address)).to.be.true;
      expect(await election.isEligible(voter3.address)).to.be.true;
    });

    it("Should emit VotersAddedBatch event", async function () {
      const voters = [voter1.address, voter2.address];
      await expect(election.addVotersBatch(voters))
        .to.emit(election, "VotersAddedBatch")
        .withArgs(2);
    });

    it("Should skip duplicates in batch add", async function () {
      await election.addVoter(voter1.address);
      const voters = [voter1.address, voter2.address];
      await election.addVotersBatch(voters);
      
      expect(await election.totalEligibleVoters()).to.equal(2);
    });

    it("Should allow owner to remove a voter", async function () {
      await election.addVoter(voter1.address);
      await election.removeVoter(voter1.address);
      
      expect(await election.isEligible(voter1.address)).to.be.false;
      expect(await election.totalEligibleVoters()).to.equal(0);
    });

    it("Should not allow non-owner to add voters", async function () {
      await expect(
        election.connect(voter1).addVoter(voter2.address)
      ).to.be.reverted;
    });

    it("Should not allow adding voters after registration phase", async function () {
      await election.addVoter(voter1.address);
      await election.startCommitPhase();
      
      await expect(
        election.addVoter(voter2.address)
      ).to.be.revertedWith("Invalid phase for this operation");
    });
  });

  describe("Phase Transitions", function () {
    beforeEach(async function () {
      await election.addVoter(voter1.address);
      await election.addVoter(voter2.address);
    });

    it("Should allow owner to start commit phase", async function () {
      await election.startCommitPhase();
      expect(await election.getCurrentPhase()).to.equal("Commit");
    });

    it("Should emit PhaseChanged event", async function () {
      await expect(election.startCommitPhase())
        .to.emit(election, "PhaseChanged");
    });

    it("Should not allow starting commit phase with no voters", async function () {
      const newElection = await Election.deploy("Empty", candidates);
      await expect(
        newElection.startCommitPhase()
      ).to.be.revertedWith("No voters registered");
    });

    it("Should transition through all phases correctly", async function () {
      // Registration -> Commit
      await election.startCommitPhase();
      expect(await election.getCurrentPhase()).to.equal("Commit");

      // Commit vote
      const salt = ethers.randomBytes(32);
      const commitment = ethers.solidityPackedKeccak256(["uint256", "bytes32"], [0, salt]);
      await election.connect(voter1).commitVote(commitment);

      // Commit -> Reveal
      await election.startRevealPhase();
      expect(await election.getCurrentPhase()).to.equal("Reveal");

      // Reveal vote
      await election.connect(voter1).revealVote(0, salt);

      // Reveal -> Ended
      await election.endElection();
      expect(await election.getCurrentPhase()).to.equal("Ended");
    });

    it("Should not allow non-owner to change phases", async function () {
      await expect(
        election.connect(voter1).startCommitPhase()
      ).to.be.reverted;
    });
  });

  describe("Commit Phase Voting", function () {
    let salt;
    let commitment;

    beforeEach(async function () {
      await election.addVoter(voter1.address);
      await election.addVoter(voter2.address);
      await election.startCommitPhase();

      salt = ethers.randomBytes(32);
      commitment = ethers.solidityPackedKeccak256(["uint256", "bytes32"], [0, salt]);
    });

    it("Should allow eligible voter to commit vote", async function () {
      await election.connect(voter1).commitVote(commitment);
      
      expect(await election.hasVoted(voter1.address)).to.be.true;
      expect(await election.totalCommitments()).to.equal(1);
    });

    it("Should emit VoteCommitted event", async function () {
      await expect(election.connect(voter1).commitVote(commitment))
        .to.emit(election, "VoteCommitted")
        .withArgs(voter1.address);
    });

    it("Should not allow committing twice", async function () {
      await election.connect(voter1).commitVote(commitment);
      
      await expect(
        election.connect(voter1).commitVote(commitment)
      ).to.be.revertedWith("Already committed");
    });

    it("Should not allow non-eligible voter to commit", async function () {
      await expect(
        election.connect(voter3).commitVote(commitment)
      ).to.be.revertedWith("Not an eligible voter");
    });

    it("Should not allow committing in wrong phase", async function () {
      const newElection = await Election.deploy("Test", candidates);
      await newElection.addVoter(voter1.address);
      
      await expect(
        newElection.connect(voter1).commitVote(commitment)
      ).to.be.revertedWith("Invalid phase for this operation");
    });

    it("Should not allow committing zero hash", async function () {
      await expect(
        election.connect(voter1).commitVote(ethers.ZeroHash)
      ).to.be.revertedWith("Invalid hash");
    });
  });

  describe("Reveal Phase Voting", function () {
    let salt1, salt2;
    let commitment1, commitment2;
    const candidateId = 0;

    beforeEach(async function () {
      await election.addVoter(voter1.address);
      await election.addVoter(voter2.address);
      await election.startCommitPhase();

      // Voter 1 commits for candidate 0
      salt1 = ethers.randomBytes(32);
      commitment1 = ethers.solidityPackedKeccak256(["uint256", "bytes32"], [candidateId, salt1]);
      await election.connect(voter1).commitVote(commitment1);

      // Voter 2 commits for candidate 1
      salt2 = ethers.randomBytes(32);
      commitment2 = ethers.solidityPackedKeccak256(["uint256", "bytes32"], [1, salt2]);
      await election.connect(voter2).commitVote(commitment2);

      await election.startRevealPhase();
    });

    it("Should allow voter to reveal vote with correct salt", async function () {
      await election.connect(voter1).revealVote(candidateId, salt1);
      
      expect(await election.hasRevealed(voter1.address)).to.be.true;
      expect(await election.totalRevealed()).to.equal(1);
    });

    it("Should emit VoteRevealed event", async function () {
      await expect(election.connect(voter1).revealVote(candidateId, salt1))
        .to.emit(election, "VoteRevealed")
        .withArgs(voter1.address, candidateId);
    });

    it("Should increment candidate vote count", async function () {
      await election.connect(voter1).revealVote(candidateId, salt1);
      
      const candidate = await election.getCandidate(candidateId);
      expect(candidate.voteCount).to.equal(1);
    });

    it("Should not allow revealing with wrong salt", async function () {
      const wrongSalt = ethers.randomBytes(32);
      
      await expect(
        election.connect(voter1).revealVote(candidateId, wrongSalt)
      ).to.be.revertedWith("Hash mismatch - invalid reveal");
    });

    it("Should not allow revealing with wrong candidate", async function () {
      await expect(
        election.connect(voter1).revealVote(1, salt1)
      ).to.be.revertedWith("Hash mismatch - invalid reveal");
    });

    it("Should not allow revealing twice", async function () {
      await election.connect(voter1).revealVote(candidateId, salt1);
      
      await expect(
        election.connect(voter1).revealVote(candidateId, salt1)
      ).to.be.revertedWith("Already revealed");
    });

    it("Should not allow revealing without commitment", async function () {
      await expect(
        election.connect(voter3).revealVote(candidateId, salt1)
      ).to.be.revertedWith("Not an eligible voter");
    });

    it("Should not allow revealing in wrong phase", async function () {
      await election.endElection();
      
      await expect(
        election.connect(voter1).revealVote(candidateId, salt1)
      ).to.be.revertedWith("Invalid phase for this operation");
    });

    it("Should not allow revealing invalid candidate ID", async function () {
      // Create new election for this test
      const newElection = await Election.deploy("Test", candidates);
      await newElection.addVoter(voter3.address);
      await newElection.startCommitPhase();
      
      const invalidId = 999;
      const saltInvalid = ethers.randomBytes(32);
      const commitInvalid = ethers.solidityPackedKeccak256(["uint256", "bytes32"], [invalidId, saltInvalid]);
      
      await newElection.connect(voter3).commitVote(commitInvalid);
      await newElection.startRevealPhase();
      
      await expect(
        newElection.connect(voter3).revealVote(invalidId, saltInvalid)
      ).to.be.revertedWith("Invalid candidate");
    });
  });

  describe("Results and Statistics", function () {
    beforeEach(async function () {
      await election.addVoter(voter1.address);
      await election.addVoter(voter2.address);
      await election.addVoter(voter3.address);
      await election.startCommitPhase();

      // Vote distribution: Alice (2), Bob (1)
      const salt1 = ethers.randomBytes(32);
      const commit1 = ethers.solidityPackedKeccak256(["uint256", "bytes32"], [0, salt1]);
      await election.connect(voter1).commitVote(commit1);

      const salt2 = ethers.randomBytes(32);
      const commit2 = ethers.solidityPackedKeccak256(["uint256", "bytes32"], [1, salt2]);
      await election.connect(voter2).commitVote(commit2);

      const salt3 = ethers.randomBytes(32);
      const commit3 = ethers.solidityPackedKeccak256(["uint256", "bytes32"], [0, salt3]);
      await election.connect(voter3).commitVote(commit3);

      await election.startRevealPhase();
      await election.connect(voter1).revealVote(0, salt1);
      await election.connect(voter2).revealVote(1, salt2);
      await election.connect(voter3).revealVote(0, salt3);
      await election.endElection();
    });

    it("Should return correct results", async function () {
      const results = await election.getResults();
      
      expect(results[0].voteCount).to.equal(2); // Alice
      expect(results[1].voteCount).to.equal(1); // Bob
      expect(results[2].voteCount).to.equal(0); // Carol
    });

    it("Should return correct winner", async function () {
      const winner = await election.getWinner();
      
      expect(winner.winnerId).to.equal(0);
      expect(winner.winnerName).to.equal("Alice");
      expect(winner.winnerVotes).to.equal(2);
    });

    it("Should not allow getting winner before election ends", async function () {
      const newElection = await Election.deploy("Test", candidates);
      
      await expect(
        newElection.getWinner()
      ).to.be.revertedWith("Election not ended");
    });

    it("Should return correct statistics", async function () {
      const stats = await election.getStats();
      
      expect(stats.eligible).to.equal(3);
      expect(stats.committed).to.equal(3);
      expect(stats.revealed).to.equal(3);
      expect(stats.phase).to.equal("Ended");
    });

    it("Should return correct candidate details", async function () {
      const candidate = await election.getCandidate(0);
      
      expect(candidate.id).to.equal(0);
      expect(candidate.name).to.equal("Alice");
      expect(candidate.voteCount).to.equal(2);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle election with maximum candidates", async function () {
      const maxCandidates = Array(50).fill("Candidate");
      const maxElection = await Election.deploy("Max Election", maxCandidates);
      
      expect(await maxElection.getCandidateCount()).to.equal(50);
    });

    it("Should revert with too many candidates", async function () {
      const tooMany = Array(51).fill("Candidate");
      
      await expect(
        Election.deploy("Too Many", tooMany)
      ).to.be.revertedWith("Too many candidates");
    });

    it("Should handle batch voter limit", async function () {
      const manyVoters = Array(101).fill(ethers.Wallet.createRandom().address);
      
      await expect(
        election.addVotersBatch(manyVoters)
      ).to.be.revertedWith("Batch too large");
    });

    it("Should handle voter not revealing (unrevealed votes)", async function () {
      await election.addVoter(voter1.address);
      await election.addVoter(voter2.address);
      await election.startCommitPhase();

      const salt = ethers.randomBytes(32);
      const commitment = ethers.solidityPackedKeccak256(["uint256", "bytes32"], [0, salt]);
      await election.connect(voter1).commitVote(commitment);
      await election.connect(voter2).commitVote(commitment);

      await election.startRevealPhase();
      // Only voter1 reveals
      await election.connect(voter1).revealVote(0, salt);

      await election.endElection();

      const stats = await election.getStats();
      expect(stats.committed).to.equal(2);
      expect(stats.revealed).to.equal(1);
    });
  });
});
