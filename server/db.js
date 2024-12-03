const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'pass@123',
  port: 5432,
});
// Test database connection (in db.js or server.js)
pool.connect()
  .then(client => {
    console.log('Connected to the database');
    client.release();
  })
  .catch(err => {
    console.error('Database connection error', err.stack);
  });

module.exports = pool;
