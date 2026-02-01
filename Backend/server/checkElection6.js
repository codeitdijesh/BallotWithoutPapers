const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { query } = require('./config/database');

async function checkElection6() {
  try {
    const result = await query('SELECT * FROM elections WHERE id = 6');
    
    if (result.rows.length > 0) {
      const election = result.rows[0];
      console.log('Election 6:');
      console.log('  Name:', election.name);
      console.log('  Contract:', election.contract_address);
      console.log('  Candidates:', JSON.stringify(election.candidates, null, 2));
      console.log('  Phase:', election.current_phase);
    } else {
      console.log('No election with ID 6 found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkElection6();
