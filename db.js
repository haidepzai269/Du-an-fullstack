const { Pool } = require('pg');
require('dotenv').config();

console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL); // 👈 Thêm dòng này

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
