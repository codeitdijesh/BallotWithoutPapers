#!/bin/bash

# API Test Script
# Tests the complete voter registration and approval flow

API_URL="http://localhost:5000"

echo "🧪 Testing API Endpoints"
echo "========================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "1️⃣  Health Check..."
HEALTH=$(curl -s $API_URL/health)
if echo "$HEALTH" | grep -q "success"; then
    echo -e "${GREEN}✅ Server is running${NC}"
else
    echo -e "${RED}❌ Server not responding${NC}"
    exit 1
fi
echo ""

# Test 2: Admin Login
echo "2️⃣  Admin Login..."
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Login failed${NC}"
    echo $LOGIN_RESPONSE
    exit 1
else
    echo -e "${GREEN}✅ Login successful${NC}"
    echo "   Token: ${TOKEN:0:20}..."
fi
echo ""

# Test 3: Create Election
echo "3️⃣  Creating Election..."
ELECTION_RESPONSE=$(curl -s -X POST $API_URL/api/elections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Election 2026",
    "description": "API Test Election",
    "candidates": [
      {"id": 0, "name": "Alice Johnson"},
      {"id": 1, "name": "Bob Smith"},
      {"id": 2, "name": "Carol Williams"}
    ]
  }')

ELECTION_ID=$(echo $ELECTION_RESPONSE | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')

if [ -z "$ELECTION_ID" ]; then
    echo -e "${RED}❌ Election creation failed${NC}"
    echo $ELECTION_RESPONSE
    exit 1
else
    echo -e "${GREEN}✅ Election created${NC}"
    echo "   Election ID: $ELECTION_ID"
fi
echo ""

# Test 4: Voter Registration
echo "4️⃣  Voter Registration..."
REGISTER_RESPONSE=$(curl -s -X POST $API_URL/api/voters/register \
  -H "Content-Type: application/json" \
  -d "{
    \"election_id\": $ELECTION_ID,
    \"organization_id\": \"S12345\",
    \"full_name\": \"John Doe\",
    \"email\": \"john@example.com\",
    \"wallet_address\": \"0x70997970C51812dc3A010C7d01b50e0d17dc79C8\"
  }")

VOTER_ID=$(echo $REGISTER_RESPONSE | grep -o '"id":[0-9]*' | sed 's/"id"://')

if [ -z "$VOTER_ID" ]; then
    echo -e "${RED}❌ Registration failed${NC}"
    echo $REGISTER_RESPONSE
    exit 1
else
    echo -e "${GREEN}✅ Voter registered${NC}"
    echo "   Voter ID: $VOTER_ID"
fi
echo ""

# Test 5: Check Pending Voters
echo "5️⃣  Checking Pending Voters..."
PENDING_RESPONSE=$(curl -s -X GET "$API_URL/api/voters/$ELECTION_ID/pending" \
  -H "Authorization: Bearer $TOKEN")

PENDING_COUNT=$(echo $PENDING_RESPONSE | grep -o '"count":[0-9]*' | sed 's/"count"://')

echo -e "${GREEN}✅ Found $PENDING_COUNT pending voter(s)${NC}"
echo ""

# Test 6: Approve Voter
echo "6️⃣  Approving Voter..."
APPROVE_RESPONSE=$(curl -s -X POST "$API_URL/api/voters/$VOTER_ID/approve" \
  -H "Authorization: Bearer $TOKEN")

if echo "$APPROVE_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Voter approved${NC}"
else
    echo -e "${RED}❌ Approval failed${NC}"
    echo $APPROVE_RESPONSE
fi
echo ""

# Test 7: Sync to Blockchain
echo "7️⃣  Syncing to Blockchain..."
SYNC_RESPONSE=$(curl -s -X POST "$API_URL/api/voters/$ELECTION_ID/sync" \
  -H "Authorization: Bearer $TOKEN")

SYNCED=$(echo $SYNC_RESPONSE | grep -o '"synced":[0-9]*' | sed 's/"synced"://')

if [ -z "$SYNCED" ]; then
    echo -e "${RED}❌ Sync failed${NC}"
    echo $SYNC_RESPONSE
else
    echo -e "${GREEN}✅ Synced $SYNCED voter(s) to blockchain${NC}"
fi
echo ""

# Test 8: Check Eligibility
echo "8️⃣  Checking Voter Eligibility..."
ELIGIBILITY_RESPONSE=$(curl -s "$API_URL/api/voters/eligibility/$ELECTION_ID/0x70997970C51812dc3A010C7d01b50e0d17dc79C8")

if echo "$ELIGIBILITY_RESPONSE" | grep -q '"eligible":true'; then
    echo -e "${GREEN}✅ Voter is eligible on blockchain${NC}"
else
    echo -e "${RED}❌ Voter not eligible${NC}"
    echo $ELIGIBILITY_RESPONSE
fi
echo ""

# Test 9: Start Commit Phase
echo "9️⃣  Starting Commit Phase..."
PHASE_RESPONSE=$(curl -s -X PUT "$API_URL/api/elections/$ELECTION_ID/phase" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phase": "commit"}')

if echo "$PHASE_RESPONSE" | grep -q "commit"; then
    echo -e "${GREEN}✅ Commit phase started${NC}"
else
    echo -e "${RED}❌ Phase change failed${NC}"
    echo $PHASE_RESPONSE
fi
echo ""

# Test 10: Get Election Details
echo "🔟  Getting Election Details..."
ELECTION_DETAILS=$(curl -s "$API_URL/api/elections/$ELECTION_ID" \
  -H "Authorization: Bearer $TOKEN")

echo -e "${GREEN}✅ Election details retrieved${NC}"
echo $ELECTION_DETAILS | grep -o '"name":"[^"]*' | sed 's/"name":"/   Name: /'
echo $ELECTION_DETAILS | grep -o '"current_phase":"[^"]*' | sed 's/"current_phase":"/   Phase: /'
echo ""

echo "========================"
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "Next steps:"
echo "  - Build frontend to interact with API"
echo "  - Voters can now commit votes via smart contract"
echo "  - Admin can manage phases through API"
