const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'voting_system',
  user: 'postgres',
  password: 'meowmeow',
});
pool.query('SELECT * FROM elections ORDER BY id LIMIT 5;')
  .then(res => {
    console.log('Elections in database:');
    console.log(JSON.stringify(res.rows, null, 2));
    return pool.end();
  })
  .catch(err => {
    console.error('Error:', err.message);
    pool.end();
  });
