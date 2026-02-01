const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'voting_system',
  user: 'postgres',
  password: 'meowmeow',
});
pool.query('SELECT election_id, COUNT(*) as count FROM voters GROUP BY election_id ORDER BY election_id;')
  .then(res => {
    console.log('Voters per election:');
    console.log(JSON.stringify(res.rows, null, 2));
    return pool.end();
  })
  .catch(err => {
    console.error('Error:', err.message);
    pool.end();
  });
