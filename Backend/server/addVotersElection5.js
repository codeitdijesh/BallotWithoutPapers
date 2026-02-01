const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'voting_system',
  user: 'postgres',
  password: 'meowmeow',
});

const sql = `
INSERT INTO voters (election_id, organization_id, full_name, email, wallet_address, registration_status)
VALUES 
  (5, 'S12345', 'John Doe', 'john.doe@university.edu', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5', 'pending'),
  (5, 'S12346', 'Jane Smith', 'jane.smith@university.edu', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c', 'pending'),
  (5, 'S12347', 'Michael Johnson', 'michael.j@university.edu', '0x6B175474E89094C44Da98b954EedeAC495271d0F', 'pending'),
  (5, 'S12348', 'Emily Davis', 'emily.davis@university.edu', '0xdAC17F958D2ee523a2206206994597C13D831ec7', 'pending'),
  (5, 'S12349', 'David Wilson', 'david.w@university.edu', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 'pending'),
  (5, 'S12350', 'Sarah Martinez', 'sarah.m@university.edu', '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 'pending')
ON CONFLICT (election_id, wallet_address) DO NOTHING;
`;

pool.query(sql)
  .then(res => {
    console.log('✅ Added 6 voters to Election 5 (Student Council Election)');
    console.log('   Rows affected:', res.rowCount);
    return pool.end();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    pool.end();
  });
