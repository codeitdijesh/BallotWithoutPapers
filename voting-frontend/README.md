# Ballot Without Papers - Frontend

React-based frontend for the blockchain voting system with commit-reveal scheme.

## Features

- **Voter Registration**: Self-registration with MetaMask wallet connection
- **Voting Interface**: Commit and reveal votes using blockchain
- **Results Display**: Real-time election results
- **Admin Dashboard**: Manage elections, approve voters, control phases

## Prerequisites

- Node.js 18+
- MetaMask browser extension
- Backend server running on `http://localhost:5000`
- Local Hardhat blockchain on `http://127.0.0.1:8545`

## Installation

```bash
npm install
```

## Configuration

Update the contract address in src/components/voter/VotingInterface.tsx:

```typescript
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // From deployment
```

## Running the App

```bash
npm start
```

Opens on `http://localhost:3000`

## User Flows

### Voter Flow

1. Register (/) - Connect MetaMask, enter details
2. Wait for admin approval
3. Vote (/voting) - Commit and reveal phases
4. View Results (/results)

### Admin Flow

1. Login (/admin/login) - admin@example.com / admin123
2. Dashboard (/admin/dashboard)
3. Create Election, Approve Voters, Manage Phases

## Technologies

- React 18 with TypeScript
- ethers.js v6
- React Router v6
- Axios
- MetaMask

## License

MIT
