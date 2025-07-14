const { Pool } = require('pg');
require('dotenv').config();

console.log('📦 Kết nối DB:', process.env.DATABASE_URL); // Debug

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
