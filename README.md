# BallotWithoutPapers

Ethereum based MVP level voting system for Hack Earth

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Backend Setup (Solidity)](#backend-setup-solidity)
- [Frontend Setup](#frontend-setup)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

BallotWithoutPapers is a decentralized voting system built on Ethereum blockchain. The backend consists of Solidity smart contracts, while the frontend is a web application that interacts with these contracts.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v16 or higher): [Download](https://nodejs.org/)
- **npm** or **yarn**: Comes with Node.js
- **Git**: [Download](https://git-scm.com/)
- **MetaMask** browser extension: [Install](https://metamask.io/)

### Verify Installation
```bash
node --version  # Should be v16 or higher
npm --version   # Should be 8 or higher
git --version
```

## Backend Setup (Solidity)

### 1. Install Hardhat (Recommended Development Framework)

Hardhat is a popular Ethereum development environment for compiling, deploying, testing, and debugging Solidity smart contracts.

```bash
# Navigate to your project directory
cd BallotWithoutPapers

# Initialize npm project (if not already done)
npm init -y

# Install Hardhat
npm install --save-dev hardhat

# Install Hardhat plugins and dependencies
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install --save-dev @nomiclabs/hardhat-ethers ethers
```

### 2. Initialize Hardhat Project

```bash
# Initialize Hardhat
npx hardhat

# Select "Create a JavaScript project" or "Create a TypeScript project"
# Accept default project root
# Add .gitignore: Yes
```

This creates the following structure:
```
contracts/      # Solidity smart contracts
scripts/        # Deployment scripts
test/           # Test files
hardhat.config.js  # Hardhat configuration
```

### 3. Install Additional Solidity Dependencies

```bash
# OpenZeppelin Contracts (for secure, audited contract libraries)
npm install @openzeppelin/contracts

# For testing
npm install --save-dev chai @nomicfoundation/hardhat-chai-matchers

# For code coverage
npm install --save-dev solidity-coverage
```

### 4. Configure Hardhat

Edit `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    // Add testnet configuration (e.g., Sepolia)
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
```

### 5. Environment Variables

Create a `.env` file in the project root:

```bash
# Create .env file
touch .env

# Add to .gitignore
echo ".env" >> .gitignore
```

Add the following to `.env`:
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_metamask_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**⚠️ IMPORTANT:** Never commit `.env` file to version control!

### 6. Install dotenv for Environment Variables

```bash
npm install dotenv
```

Update `hardhat.config.js` to load environment variables:
```javascript
require("dotenv").config();
```

## Frontend Setup

### 1. Create React Frontend

```bash
# Create React app
npx create-react-app frontend
cd frontend

# Install Web3 libraries
npm install ethers  # Recommended - Modern, lightweight
# OR
npm install web3    # Alternative - Traditional Web3 library
```

### 2. Install Additional Frontend Dependencies

```bash
# Install UI libraries (optional but recommended)
npm install @mui/material @emotion/react @emotion/styled  # Material-UI
npm install react-router-dom  # For routing

# Install wallet connection library
npm install @web3-react/core @web3-react/injected-connector
```

### 3. Project Structure

Recommended frontend structure:
```
frontend/
├── src/
│   ├── components/     # React components
│   ├── contracts/      # ABI files from compiled contracts
│   ├── utils/          # Web3 utility functions
│   ├── hooks/          # Custom React hooks
│   ├── App.js
│   └── index.js
├── public/
└── package.json
```

### 4. Connect Frontend to Smart Contracts

Create `src/utils/web3.js`:

```javascript
import { ethers } from 'ethers';

// Connect to MetaMask
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      return { provider, signer, address };
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  } else {
    alert("Please install MetaMask!");
    throw new Error("MetaMask not found");
  }
};

// Get contract instance
export const getContract = (contractAddress, abi, signer) => {
  return new ethers.Contract(contractAddress, abi, signer);
};
```

Create `src/utils/contractInteraction.js`:

```javascript
import { getContract } from './web3';
import BallotABI from '../contracts/Ballot.json';  // ABI from compiled contract

const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

export const getBallotContract = (signer) => {
  return getContract(CONTRACT_ADDRESS, BallotABI.abi, signer);
};

// Example: Vote function
export const vote = async (signer, proposalId) => {
  const contract = getBallotContract(signer);
  const tx = await contract.vote(proposalId);
  await tx.wait();  // Wait for transaction confirmation
  return tx;
};

// Example: Get proposal
export const getProposal = async (provider, proposalId) => {
  const contract = getBallotContract(provider);
  return await contract.proposals(proposalId);
};
```

### 5. Copy Contract ABIs to Frontend

After compiling contracts with Hardhat:

```bash
# From project root
cp artifacts/contracts/Ballot.sol/Ballot.json frontend/src/contracts/

# Or create a script to automate this
```

Create `scripts/copy-artifacts.js`:
```javascript
const fs = require('fs');
const path = require('path');

const artifactsPath = path.join(__dirname, '../artifacts/contracts');
const frontendPath = path.join(__dirname, '../frontend/src/contracts');

// Create directory if it doesn't exist
if (!fs.existsSync(frontendPath)) {
  fs.mkdirSync(frontendPath, { recursive: true });
}

// Copy ABI files
fs.readdirSync(artifactsPath).forEach(file => {
  const contractPath = path.join(artifactsPath, file);
  if (fs.statSync(contractPath).isDirectory()) {
    fs.readdirSync(contractPath).forEach(contractFile => {
      if (contractFile.endsWith('.json') && !contractFile.endsWith('.dbg.json')) {
        fs.copyFileSync(
          path.join(contractPath, contractFile),
          path.join(frontendPath, contractFile)
        );
      }
    });
  }
});

console.log('Contract ABIs copied to frontend!');
```

Add to `package.json`:
```json
"scripts": {
  "copy-contracts": "node scripts/copy-artifacts.js"
}
```

## Development Workflow

### 1. Start Local Blockchain

```bash
# Terminal 1: Start Hardhat node
npx hardhat node

# This starts a local Ethereum network at http://localhost:8545
```

### 2. Compile Contracts

```bash
# Compile Solidity contracts
npx hardhat compile

# This creates artifacts in the artifacts/ directory
```

### 3. Deploy Contracts

```bash
# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet (e.g., Sepolia)
npx hardhat run scripts/deploy.js --network sepolia
```

Example `scripts/deploy.js`:
```javascript
const hre = require("hardhat");

async function main() {
  const Ballot = await hre.ethers.getContractFactory("Ballot");
  const ballot = await Ballot.deploy();
  await ballot.waitForDeployment();
  
  console.log("Ballot contract deployed to:", await ballot.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 4. Copy Contract ABIs to Frontend

```bash
npm run copy-contracts
```

### 5. Configure MetaMask

1. Open MetaMask
2. Add local network:
   - Network Name: Hardhat Local
   - RPC URL: http://localhost:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

3. Import test account:
   - Copy a private key from Hardhat node output
   - Import into MetaMask

### 6. Start Frontend

```bash
# Terminal 2: Start React app
cd frontend
npm start

# App runs at http://localhost:3000
```

## Testing

### Backend Testing (Solidity)

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/Ballot.test.js

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run code coverage
npx hardhat coverage
```

Example test file `test/Ballot.test.js`:
```javascript
const { expect } = require("chai");

describe("Ballot", function () {
  it("Should allow voting", async function () {
    const Ballot = await ethers.getContractFactory("Ballot");
    const ballot = await Ballot.deploy();
    await ballot.waitForDeployment();

    const [owner, voter] = await ethers.getSigners();
    await ballot.connect(voter).vote(0);
    
    expect(await ballot.hasVoted(voter.address)).to.equal(true);
  });
});
```

### Frontend Testing

```bash
cd frontend
npm test
```

## Deployment

### Deploy to Testnet (Sepolia)

1. Get testnet ETH:
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Enter your MetaMask address

2. Deploy:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. Verify contract on Etherscan:
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Deploy to Mainnet

⚠️ **Use extreme caution when deploying to mainnet!**

1. Audit your contracts
2. Test thoroughly on testnet
3. Use a hardware wallet for mainnet deployments
4. Deploy:
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

## Troubleshooting

### Common Issues

**1. "Cannot find module 'hardhat'"**
```bash
npm install --save-dev hardhat
```

**2. "Error: insufficient funds"**
- Ensure your wallet has enough ETH for gas fees
- Get testnet ETH from a faucet

**3. "MetaMask - RPC Error: Invalid parameters"**
- Check network configuration
- Ensure you're connected to the correct network

**4. "Contract not deployed"**
- Run deployment script first
- Update contract address in frontend

**5. "Nonce too high"**
- Reset MetaMask account: Settings → Advanced → Reset Account

### Useful Commands

```bash
# Clean Hardhat cache
npx hardhat clean

# Get Hardhat accounts
npx hardhat accounts

# Run Hardhat console
npx hardhat console --network localhost

# Check contract size
npx hardhat size-contracts
```

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Ethereum Development Documentation](https://ethereum.org/en/developers/)

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
