const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // dùng cho Neon bắt buộc SSL
  }
});

console.log('✅ Đã cấu hình PostgreSQL thành công');

module.exports = pool;
