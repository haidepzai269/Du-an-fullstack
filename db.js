const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  host: 'db.ggjadhmvoflzsgokfozj.supabase.co', // 🟢 Buộc dùng hostname IPv4
  port: 5432,
});

console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL);

module.exports = pool;
