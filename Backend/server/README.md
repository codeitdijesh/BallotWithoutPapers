# API Server - Ballot Without Papers

REST API server for managing voter registration, approval, and blockchain integration.

## 🏗️ Architecture

```
Frontend (React) ←→ API Server (Express) ←→ Database (PostgreSQL)
                          ↓
                   Smart Contracts (Ethereum)
```

## ✨ Features

- **Voter Self-Registration**: Voters register with org ID, name, and wallet
- **Admin Approval System**: Admins verify and approve/reject voters
- **Blockchain Sync**: Approved voters automatically added to smart contract
- **JWT Authentication**: Secure admin endpoints
- **Privacy-Preserving**: Personal data stays off-chain

## 📋 Prerequisites

1. **PostgreSQL** (v12+)
2. **Node.js** (v18+)
3. **Smart Contracts Deployed** (Backend/contracts)

## 🚀 Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup PostgreSQL Database

```bash
# Create database
createdb voting_system

# Or using psql
psql -U postgres
CREATE DATABASE voting_system;
\q
```

### 3. Run Database Schema

```bash
psql -U postgres -d voting_system -f ../database/schema.sql
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=voting_system
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_change_this

# Blockchain (use local Hardhat node for development)
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
ADMIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 5. Start Server

```bash
npm start
# or with auto-reload
npm run dev
```

Server runs on `http://localhost:5000`

## 🔐 Default Admin Credentials

**Email**: `admin@example.com`  
**Password**: `admin123`

⚠️ **CHANGE THIS IN PRODUCTION!**

## 📡 API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": 1,
      "email": "admin@example.com",
      "full_name": "System Administrator"
    }
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Elections

#### Create Election
```http
POST /api/elections
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "2026 General Election",
  "description": "Annual general election",
  "candidates": [
    { "id": 0, "name": "Alice Johnson" },
    { "id": 1, "name": "Bob Smith" },
    { "id": 2, "name": "Carol Williams" }
  ]
}

Response:
{
  "success": true,
  "message": "Election created successfully",
  "data": {
    "election": {
      "id": 1,
      "contract_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      "name": "2026 General Election",
      "current_phase": "registration"
    }
  }
}
```

#### Get All Elections
```http
GET /api/elections
Authorization: Bearer <token>
```

#### Get Single Election
```http
GET /api/elections/:id
Authorization: Bearer <token>
```

#### Update Phase
```http
PUT /api/elections/:id/phase
Authorization: Bearer <token>
Content-Type: application/json

{
  "phase": "commit"  // registration | commit | reveal | ended
}
```

#### Get Results
```http
GET /api/elections/:id/results
Authorization: Bearer <token>
```

### Voters

#### Register as Voter (PUBLIC)
```http
POST /api/voters/register
Content-Type: application/json

{
  "election_id": 1,
  "organization_id": "S12345",
  "full_name": "John Doe",
  "email": "john@example.com",
  "wallet_address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
}

Response:
{
  "success": true,
  "message": "Registration successful. Awaiting admin approval.",
  "data": {
    "voter": {
      "id": 1,
      "organization_id": "S12345",
      "registration_status": "pending"
    }
  }
}
```

#### Check Eligibility (PUBLIC)
```http
GET /api/voters/eligibility/:election_id/:wallet_address
```

#### Get Pending Voters (ADMIN)
```http
GET /api/voters/:election_id/pending
Authorization: Bearer <token>
```

#### Get All Voters (ADMIN)
```http
GET /api/voters/:election_id/all?status=approved
Authorization: Bearer <token>
```

#### Approve Voter (ADMIN)
```http
POST /api/voters/:voter_id/approve
Authorization: Bearer <token>
```

#### Reject Voter (ADMIN)
```http
POST /api/voters/:voter_id/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Invalid student ID"
}
```

#### Sync to Blockchain (ADMIN)
```http
POST /api/voters/:election_id/sync
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Voters synced to blockchain",
  "data": {
    "synced": 5,
    "transactions": [...]
  }
}
```

## 🔄 Complete Workflow

### 1. Admin Creates Election

```bash
curl -X POST http://localhost:5000/api/elections \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Election",
    "candidates": [
      {"id": 0, "name": "Alice"},
      {"id": 1, "name": "Bob"}
    ]
  }'
```

### 2. Voter Registers

```bash
curl -X POST http://localhost:5000/api/voters/register \
  -H "Content-Type: application/json" \
  -d '{
    "election_id": 1,
    "organization_id": "S12345",
    "full_name": "John Doe",
    "email": "john@example.com",
    "wallet_address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  }'
```

### 3. Admin Sees Pending Registrations

```bash
curl http://localhost:5000/api/voters/1/pending \
  -H "Authorization: Bearer <token>"
```

### 4. Admin Approves Voter

```bash
curl -X POST http://localhost:5000/api/voters/1/approve \
  -H "Authorization: Bearer <token>"
```

### 5. Admin Syncs to Blockchain

```bash
curl -X POST http://localhost:5000/api/voters/1/sync \
  -H "Authorization: Bearer <token>"
```

Now voter can vote on the blockchain!

### 6. Admin Starts Voting

```bash
curl -X PUT http://localhost:5000/api/elections/1/phase \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"phase": "commit"}'
```

## 🗄️ Database Schema

### Tables

**admins**
- id, email, password_hash, full_name, created_at, last_login

**elections**
- id, contract_address, name, description, candidates (JSON)
- registration_start/end, voting_start/end, reveal_end
- current_phase, created_by, created_at, updated_at

**voters**
- id, election_id, organization_id, full_name, email, wallet_address
- registration_status (pending/approved/rejected)
- blockchain_synced, has_committed, has_revealed
- approved_by, approved_at, rejection_reason
- registered_at, updated_at

## 🔒 Security Features

- ✅ JWT authentication for admin endpoints
- ✅ Password hashing with bcrypt
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection protection (parameterized queries)
- ✅ Rate limiting (TODO)

## 🧪 Testing

### Manual Testing with cURL

See examples above in workflow section.

### Postman Collection

Import API endpoints into Postman:
1. Create new collection
2. Add Bearer token authentication
3. Add endpoints from this documentation

## 📊 Privacy Considerations

### What's Stored Off-Chain (Database):
- Organization ID
- Full Name
- Email
- Wallet Address
- Registration Status

### What's On-Chain (Blockchain):
- Wallet Address (in whitelist)
- Vote Commitment Hash
- Revealed Vote (address → candidate linkable)

### Admin Can See:
- Database: Full voter details
- Blockchain: Voter address voted for which candidate (after reveal)
- **Cross-reference**: Admin CAN link name → address → vote

### For Enhanced Privacy:
- Use anonymous registration codes
- Implement zero-knowledge proofs (advanced)
- Use blind signatures (medium complexity)
- Keep personal data minimal

## 🚧 Production Deployment

### 1. Environment Variables

```env
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
DB_PASSWORD=<strong-password>
ADMIN_PRIVATE_KEY=<secure-wallet-key>
CORS_ORIGIN=https://yourdomain.com
```

### 2. Database Security

- Use SSL connections
- Restrict database access by IP
- Regular backups
- Encryption at rest

### 3. Server Security

- Use HTTPS only
- Add rate limiting
- Implement request logging
- Set up monitoring
- Use environment-specific configs

### 4. Blockchain

- Use Sepolia testnet or mainnet
- Secure private key management (use HSM or vault)
- Gas price optimization
- Transaction monitoring

## 📝 File Structure

```
server/
├── config/
│   └── database.js          # PostgreSQL configuration
├── controllers/
│   ├── authController.js    # Login, profile
│   ├── electionController.js # Election CRUD, phase management
│   └── voterController.js   # Registration, approval, sync
├── middleware/
│   └── auth.js              # JWT authentication
├── routes/
│   ├── auth.js              # Auth routes
│   ├── elections.js         # Election routes
│   └── voters.js            # Voter routes
├── services/
│   └── blockchain.js        # Smart contract integration
├── server.js                # Main server file
├── package.json
└── .env
```

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running and credentials are correct

### Blockchain Connection Error
```
Failed to initialize blockchain service
```
**Solution**: Start Hardhat node (`npm run node` in Backend folder)

### JWT Secret Not Set
```
Error: JWT_SECRET not set
```
**Solution**: Add JWT_SECRET to `.env` file

### Contract Not Found
```
Failed to load contract
```
**Solution**: Deploy contract first, update CONTRACT_ADDRESS in `.env`

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [ethers.js Documentation](https://docs.ethers.org/)

---

**Ready for Frontend Integration!** 🚀
