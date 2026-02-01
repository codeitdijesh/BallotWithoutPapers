const { query } = require('../server/config/database');

const dummyVoters = [
  {
    election_id: 1,
    organization_id: 'S12345',
    full_name: 'John Doe',
    email: 'john.doe@university.edu',
    wallet_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5'
  },
  {
    election_id: 1,
    organization_id: 'S12346',
    full_name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    wallet_address: '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c'
  },
  {
    election_id: 1,
    organization_id: 'S12347',
    full_name: 'Michael Johnson',
    email: 'michael.j@university.edu',
    wallet_address: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  },
  {
    election_id: 1,
    organization_id: 'S12348',
    full_name: 'Emily Davis',
    email: 'emily.davis@university.edu',
    wallet_address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  },
  {
    election_id: 1,
    organization_id: 'S12349',
    full_name: 'David Wilson',
    email: 'david.w@university.edu',
    wallet_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  },
  {
    election_id: 1,
    organization_id: 'S12350',
    full_name: 'Sarah Martinez',
    email: 'sarah.m@university.edu',
    wallet_address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
  }
];

async function addDummyVoters() {
  try {
    console.log('✅ Adding dummy voters...\n');

    for (const voter of dummyVoters) {
      try {
        const result = await query(
          `INSERT INTO voters (election_id, organization_id, full_name, email, wallet_address, registration_status)
           VALUES ($1, $2, $3, $4, $5, 'pending')
           ON CONFLICT (election_id, wallet_address) DO NOTHING
           RETURNING *`,
          [
            voter.election_id,
            voter.organization_id,
            voter.full_name,
            voter.email,
            voter.wallet_address
          ]
        );

        if (result.rows.length > 0) {
          console.log(`✅ Added voter: ${voter.full_name} (${voter.organization_id})`);
        } else {
          console.log(`⚠️  Voter already exists: ${voter.full_name}`);
        }
      } catch (error) {
        console.error(`❌ Error adding ${voter.full_name}:`, error.message);
      }
    }

    console.log('\n🎉 Dummy voters added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addDummyVoters();
