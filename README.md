# Blockchain Voting System

Secure blockchain-based voting with commit-reveal scheme, Node.js backend, and React frontend.

## Quick Start

```powershell
# 1. Setup database
.\setup-database.ps1

# 2. Start all services (Hardhat, Backend, Frontend)
.\start-all.ps1

# 3. (Optional) Add test voters
.\add-dummy-voters.ps1
```

**Admin Login:** http://localhost:3000
- Email: `admin@example.com`
- Password: `admin123`

## Prerequisites

Node.js 16+, PostgreSQL 12+, MetaMask browser extension

## Project Structure

- **Backend/** - Solidity contracts, Express API, database
- **voting-frontend/** - React/TypeScript UI with MetaMask

## Features

- **Commit-Reveal Voting** - Two-phase voting for privacy
- **Admin Dashboard** - Create elections, approve voters, manage phases
- **Voter Registration** - Self-registration with admin approval
- **Smart Contract** - Ethereum-based vote storage and tallying

## API Endpoints

- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Voter registration
- `GET /api/elections` - List elections
- `POST /api/elections` - Create election (admin)
- `POST /api/elections/:id/vote` - Cast vote
- `GET /api/voters/pending` - Pending voters (admin)
- `PUT /api/voters/:id/approve` - Approve voter (admin)

## Testing

```powershell
cd Backend
npm test  # 46 tests, all passing
```

## Troubleshooting

### Failed to Create Election
**Error:** Election creation fails with timeout or error message

**Solution:** Ensure Hardhat blockchain node is running
```powershell
# Check if Hardhat is running on port 8545
Get-NetTCPConnection -LocalPort 8545 -ErrorAction SilentlyContinue

# If not running, start it in Backend folder
cd Backend
npx hardhat node
```

### Port Already in Use
```powershell
# Backend (port 3001)
Get-NetTCPConnection -LocalPort 3001 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }

# Frontend (port 3000)
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }

# Hardhat (port 8545)
Get-NetTCPConnection -LocalPort 8545 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

### MetaMask Issues
- Ensure Hardhat node is running on port 8545
- Import Hardhat account #0 with private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- Reset account in MetaMask settings if transactions fail
- Check network is set to `Localhost 8545`

### Database Connection Fails
- Verify PostgreSQL is running: `Get-Service -Name postgresql*`
- Check credentials in `Backend/server/.env`
- Ensure database `voting_system` exists
- Run `.\setup-database.ps1` if database not initialized

### Services Not Starting
Check which services are running:
```powershell
# View all node processes and their ports
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Select-Object Id, ProcessName
```

**Required services:**
- Hardhat node on port 8545
- Backend API on port 3001  
- Frontend on port 3000

## Environment Variables

Create `Backend/server/.env`:
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=voting_system
JWT_SECRET=your_secret_key
```

## TODO

### High Priority
-[ ] Metamask Integration
- [ ] Fix commit-reveal UI flow in frontend
- [ ] Add salt generation/storage for voter commits
- [ ] Implement reveal phase interface
- [ ] Add election phase transitions in admin dashboard
- [ ] Display real-time voting statistics

### Medium Priority
- [ ] Add input validation for all forms
- [ ] Improve error messages and user feedback
- [ ] Add loading states for blockchain transactions
- [ ] Implement proper MetaMask connection error handling
- [ ] Add voter eligibility status display

### Low Priority
- [ ] Add dark mode support
- [ ] Improve mobile responsiveness
- [ ] Add email notifications for voter approval
- [ ] Create comprehensive frontend tests
- [ ] Add transaction history view

### Future Enhancements
- [ ] Multi-election support
- [ ] Zero-knowledge proofs for stronger anonymity
- [ ] Merkle tree whitelists for gas optimization
- [ ] Time-based automatic phase transitions
- [ ] Delegate voting support
- [ ] Deploy to Sepolia testnet

## License

MIT
