const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

/**
 * Blockchain Service for interacting with Election smart contract
 */
class BlockchainService {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.contract = null;
    this.initialized = false;
  }

  /**
   * Initialize connection to blockchain and contract
   */
  async initialize() {
    try {
      // Connect to blockchain
      const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      // Setup admin wallet
      const privateKey = process.env.ADMIN_PRIVATE_KEY;
      if (!privateKey) {
        throw new Error('ADMIN_PRIVATE_KEY not set in environment');
      }
      this.wallet = new ethers.Wallet(privateKey, this.provider);

      console.log('✅ Blockchain connection established');
      console.log('   Admin wallet:', this.wallet.address);

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error.message);
      return false;
    }
  }

  /**
   * Load contract instance for specific election
   */
  async loadContract(contractAddress) {
    try {
      // Load ABI from compiled contract
      const artifactPath = path.join(__dirname, '../../artifacts/contracts/Election.sol/Election.json');
      const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
      
      this.contract = new ethers.Contract(
        contractAddress,
        artifact.abi,
        this.wallet
      );

      console.log('✅ Contract loaded:', contractAddress);
      return this.contract;
    } catch (error) {
      console.error('❌ Failed to load contract:', error.message);
      throw error;
    }
  }

  /**
   * Deploy new election contract
   */
  async deployElection(electionName, candidates) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const artifactPath = path.join(__dirname, '../../artifacts/contracts/Election.sol/Election.json');
      const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

      const factory = new ethers.ContractFactory(
        artifact.abi,
        artifact.bytecode,
        this.wallet
      );

      console.log('📝 Deploying election contract...');
      console.log('   Name:', electionName);
      console.log('   Candidates:', candidates.length);

      const contract = await factory.deploy(electionName, candidates);
      await contract.waitForDeployment();

      const address = await contract.getAddress();
      console.log('✅ Contract deployed to:', address);

      return address;
    } catch (error) {
      console.error('❌ Failed to deploy contract:', error.message);
      throw error;
    }
  }

  /**
   * Add voters to contract (batch)
   */
  async addVotersBatch(contractAddress, voterAddresses) {
    try {
      const contract = await this.loadContract(contractAddress);

      // Validate addresses
      const validAddresses = voterAddresses.filter(addr => 
        ethers.isAddress(addr)
      );

      if (validAddresses.length === 0) {
        throw new Error('No valid addresses provided');
      }

      // Batch add (max 100 at a time per contract limit)
      const batchSize = 100;
      const results = [];

      for (let i = 0; i < validAddresses.length; i += batchSize) {
        const batch = validAddresses.slice(i, i + batchSize);
        
        console.log(`📦 Adding voters batch ${Math.floor(i/batchSize) + 1}...`);
        console.log(`   Addresses: ${batch.length}`);

        const tx = await contract.addVotersBatch(batch);
        const receipt = await tx.wait();

        results.push({
          batch: Math.floor(i/batchSize) + 1,
          count: batch.length,
          txHash: receipt.hash,
          gasUsed: receipt.gasUsed.toString(),
        });

        console.log(`   ✅ Transaction: ${receipt.hash}`);
      }

      return results;
    } catch (error) {
      console.error('❌ Failed to add voters:', error.message);
      throw error;
    }
  }

  /**
   * Check if address is eligible voter
   */
  async isEligible(contractAddress, voterAddress) {
    try {
      const contract = await this.loadContract(contractAddress);
      return await contract.isEligible(voterAddress);
    } catch (error) {
      console.error('❌ Failed to check eligibility:', error);
      return false;
    }
  }

  /**
   * Start commit phase
   */
  async startCommitPhase(contractAddress) {
    try {
      const contract = await this.loadContract(contractAddress);
      const tx = await contract.startCommitPhase();
      const receipt = await tx.wait();
      
      console.log('✅ Commit phase started');
      console.log('   Transaction:', receipt.hash);
      
      return receipt;
    } catch (error) {
      console.error('❌ Failed to start commit phase:', error.message);
      throw error;
    }
  }

  /**
   * Start reveal phase
   */
  async startRevealPhase(contractAddress) {
    try {
      const contract = await this.loadContract(contractAddress);
      const tx = await contract.startRevealPhase();
      const receipt = await tx.wait();
      
      console.log('✅ Reveal phase started');
      console.log('   Transaction:', receipt.hash);
      
      return receipt;
    } catch (error) {
      console.error('❌ Failed to start reveal phase:', error.message);
      throw error;
    }
  }

  /**
   * End election
   */
  async endElection(contractAddress) {
    try {
      const contract = await this.loadContract(contractAddress);
      const tx = await contract.endElection();
      const receipt = await tx.wait();
      
      console.log('✅ Election ended');
      console.log('   Transaction:', receipt.hash);
      
      return receipt;
    } catch (error) {
      console.error('❌ Failed to end election:', error.message);
      throw error;
    }
  }

  /**
   * Get election statistics
   */
  async getStats(contractAddress) {
    try {
      const contract = await this.loadContract(contractAddress);
      const stats = await contract.getStats();
      
      return {
        eligible: stats.eligible.toString(),
        committed: stats.committed.toString(),
        revealed: stats.revealed.toString(),
        phase: stats.phase,
      };
    } catch (error) {
      console.error('❌ Failed to get stats:', error.message);
      throw error;
    }
  }

  /**
   * Get election results
   */
  async getResults(contractAddress) {
    try {
      const contract = await this.loadContract(contractAddress);
      const results = await contract.getResults();
      
      return results.map(candidate => ({
        id: candidate.id.toString(),
        name: candidate.name,
        voteCount: candidate.voteCount.toString(),
      }));
    } catch (error) {
      console.error('❌ Failed to get results:', error.message);
      throw error;
    }
  }

  /**
   * Get winner
   */
  async getWinner(contractAddress) {
    try {
      const contract = await this.loadContract(contractAddress);
      const winner = await contract.getWinner();
      
      return {
        winnerId: winner.winnerId.toString(),
        winnerName: winner.winnerName,
        winnerVotes: winner.winnerVotes.toString(),
      };
    } catch (error) {
      console.error('❌ Failed to get winner:', error.message);
      throw error;
    }
  }

  /**
   * Get current phase
   */
  async getCurrentPhase(contractAddress) {
    try {
      const contract = await this.loadContract(contractAddress);
      return await contract.getCurrentPhase();
    } catch (error) {
      console.error('❌ Failed to get phase:', error.message);
      throw error;
    }
  }
}

// Singleton instance
const blockchainService = new BlockchainService();

module.exports = blockchainService;
