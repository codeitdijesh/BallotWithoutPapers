# Backend - Blockchain Voting System

Smart contracts and scripts for the BallotWithoutPapers voting system.

## Features

- ✅ **Commit-Reveal Voting**: Two-phase voting for vote privacy
- ✅ **Admin Controls**: Manual voter whitelist management
- ✅ **Phase Management**: Registration → Commit → Reveal → Ended
- ✅ **Gas Optimized**: Batch voter addition, efficient storage
- ✅ **Secure**: OpenZeppelin contracts, ReentrancyGuard

## Contract Architecture

### Election.sol
Main contract implementing:
- Voter eligibility management (whitelist)
- Two-phase commit-reveal voting
- Phase transitions
- Result tallying and winner calculation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your private key and RPC URL
```

3. Compile contracts:
```bash
npm run compile
```

4. Run tests:
```bash
npm test
```

## Local Development

1. Start local Hardhat node:
```bash
npm run node
```

2. Deploy contract (in another terminal):
```bash
npm run deploy:local
```

3. Add voters:
```bash
node scripts/addVoters.js
```

4. Test voting flow:
```bash
node scripts/testVoting.js
```

## Deployment to Sepolia

1. Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

2. Configure `.env` with your private key and Infura/Alchemy RPC URL

3. Deploy:
```bash
npm run deploy:sepolia
```

## Usage

### Admin Workflow

1. **Deploy Contract**
   - Sets election name and candidates
   - Deploys to network

2. **Add Voters** (Registration Phase)
   ```javascript
   await election.addVoter(voterAddress);
   // or batch
   await election.addVotersBatch([addr1, addr2, addr3]);
   ```

3. **Start Commit Phase**
   ```javascript
   await election.startCommitPhase();
   ```

4. **Start Reveal Phase** (after voters commit)
   ```javascript
   await election.startRevealPhase();
   ```

5. **End Election** (after voters reveal)
   ```javascript
   await election.endElection();
   ```

6. **View Results**
   ```javascript
   const results = await election.getResults();
   const winner = await election.getWinner();
   ```

### Voter Workflow

1. **Check Eligibility**
   ```javascript
   const eligible = await election.isEligible(voterAddress);
   ```

2. **Commit Vote** (Commit Phase)
   ```javascript
   // Generate commitment hash off-chain
   const salt = ethers.randomBytes(32);
   const hash = ethers.solidityPackedKeccak256(
     ["uint256", "bytes32"],
     [candidateId, salt]
   );
   
   // Submit commitment
   await election.commitVote(hash);
   
   // IMPORTANT: Save salt securely! Needed for reveal.
   ```

3. **Reveal Vote** (Reveal Phase)
   ```javascript
   await election.revealVote(candidateId, salt);
   ```

## Contract Functions

### Admin Functions
- `addVoter(address)` - Add single voter
- `addVotersBatch(address[])` - Add multiple voters
- `removeVoter(address)` - Remove voter
- `startCommitPhase()` - Begin voting
- `startRevealPhase()` - Begin reveals
- `endElection()` - Finalize election

### Voter Functions
- `commitVote(bytes32)` - Submit vote commitment
- `revealVote(uint256, bytes32)` - Reveal vote

### View Functions
- `isEligible(address)` - Check voter eligibility
- `hasVoted(address)` - Check if committed
- `hasRevealed(address)` - Check if revealed
- `getResults()` - Get all candidates with votes
- `getWinner()` - Get winning candidate
- `getStats()` - Get election statistics
- `getCurrentPhase()` - Get current phase

## Testing

Comprehensive test suite covering:
- Deployment validation
- Voter management (add/remove/batch)
- Phase transitions
- Commit-reveal voting flow
- Results and statistics
- Edge cases and security

Run tests:
```bash
npm test
```

## Security Features

- ✅ Ownable (admin controls)
- ✅ ReentrancyGuard
- ✅ Input validation
- ✅ Phase enforcement
- ✅ Commit-reveal scheme
- ✅ No double voting
- ✅ Hash verification

## Gas Optimization

- Batch voter addition (up to 100 per tx)
- Efficient mappings
- Minimal storage
- Optimized compiler settings

## File Structure

```
Backend/
├── contracts/
│   └── Election.sol           # Main voting contract
├── scripts/
│   ├── deploy.js              # Deployment script
│   ├── addVoters.js           # Manual voter addition
│   └── testVoting.js          # Full voting simulation
├── test/
│   └── Election.test.js       # Comprehensive tests
├── hardhat.config.js          # Hardhat configuration
├── package.json               # Dependencies
└── .env.example               # Environment template
```

## Troubleshooting

**Issue**: "Invalid phase for this operation"
- **Solution**: Check current phase with `getCurrentPhase()`

**Issue**: "Not an eligible voter"
- **Solution**: Admin must add voter address first

**Issue**: "Hash mismatch - invalid reveal"
- **Solution**: Ensure correct candidateId and salt from commit phase

**Issue**: "Already committed"
- **Solution**: Each voter can only commit once

## Next Steps

- [ ] Build React frontend
- [ ] Integrate with MetaMask
- [ ] Add CSV voter import
- [ ] Deploy to mainnet
- [ ] Add event monitoring
- [ ] Create admin dashboard

## License

MIT
