const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { query } = require('./config/database');

async function addPendingVoters() {
  try {
    console.log('Adding pending voters for election 6...\n');

    // Sample pending voters with realistic data
    const pendingVoters = [
      {
        organizationId: 'S12345',
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@university.edu',
        walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' // Hardhat account #1
      },
      {
        organizationId: 'S12346',
        fullName: 'Michael Chen',
        email: 'michael.chen@university.edu',
        walletAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' // Hardhat account #2
      },
      {
        organizationId: 'S12347',
        fullName: 'Emily Rodriguez',
        email: 'emily.rodriguez@university.edu',
        walletAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' // Hardhat account #3
      },
      {
        organizationId: 'S12348',
        fullName: 'David Kim',
        email: 'david.kim@university.edu',
        walletAddress: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65' // Hardhat account #4
      },
      {
        organizationId: 'S12349',
        fullName: 'Jessica Martinez',
        email: 'jessica.martinez@university.edu',
        walletAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc' // Hardhat account #5
      },
      {
        organizationId: 'S12350',
        fullName: 'Ryan Thompson',
        email: 'ryan.thompson@university.edu',
        walletAddress: '0x976EA74026E726554dB657fA54763abd0C3a0aa9' // Hardhat account #6
      },
      {
        organizationId: 'S12351',
        fullName: 'Amanda Lee',
        email: 'amanda.lee@university.edu',
        walletAddress: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955' // Hardhat account #7
      },
      {
        organizationId: 'S12352',
        fullName: 'James Wilson',
        email: 'james.wilson@university.edu',
        walletAddress: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f' // Hardhat account #8
      }
    ];

    console.log(`Adding ${pendingVoters.length} pending voters...\n`);

    for (const voter of pendingVoters) {
      try {
        const result = await query(
          `INSERT INTO voters (election_id, organization_id, full_name, email, wallet_address, registration_status)
           VALUES ($1, $2, $3, $4, $5, 'pending')
           ON CONFLICT (election_id, organization_id) DO NOTHING
           RETURNING id, organization_id, full_name`,
          [6, voter.organizationId, voter.fullName, voter.email, voter.walletAddress]
        );

        if (result.rows.length > 0) {
          console.log(`✅ Added: ${voter.fullName} (${voter.organizationId})`);
        } else {
          console.log(`⚠️  Skipped: ${voter.fullName} (${voter.organizationId}) - already exists`);
        }
      } catch (err) {
        console.log(`❌ Error adding ${voter.fullName}: ${err.message}`);
      }
    }

    // Check total pending voters
    const countResult = await query(
      `SELECT COUNT(*) as count FROM voters 
       WHERE election_id = 6 AND registration_status = 'pending'`
    );

    console.log(`\n✅ Total pending voters for election 6: ${countResult.rows[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addPendingVoters();
