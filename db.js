const dns = require('dns');
const { Pool } = require('pg');
require('dotenv').config();

dns.setDefaultResultOrder('ipv4first'); // Ưu tiên IPv4 thay vì IPv6

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL);

module.exports = pool;
