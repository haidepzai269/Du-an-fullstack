const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: 'db.ggjadhmvoflzsgokfozj.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'haidepzai269',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log('✅ Đang kết nối tới Supabase...');

module.exports = pool;
