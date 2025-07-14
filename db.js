const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: 'db.ggjadhmvoflzsgokfozj.supabase.co',     // ✅ IPv4 host
  port: 5432,
  user: 'postgres',
  password: 'haidepzai269',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

console.log('✅ Đã cấu hình PostgreSQL thành công');

module.exports = pool;
