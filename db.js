const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); // Ưu tiên IPv4

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  password: 'haidepzai269',
  host: 'db.ggjadhmvoflzsgokfozj.supabase.co', // hostname
  port: 5432,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
