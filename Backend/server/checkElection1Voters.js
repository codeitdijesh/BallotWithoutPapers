const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'voting_system',
  user: 'postgres',
  password: 'meowmeow',
});
pool.query('SELECT * FROM voters WHERE election_id = 1 ORDER BY id;')
  .then(res => {
    console.log('Voters in Election 1:');
    console.log(JSON.stringify(res.rows, null, 2));
    return pool.end();
  })
  .catch(err => {
    console.error('Error:', err.message);
    pool.end();
  });
