const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  password: 'haidepzai269',
  host: '76.76.21.93', // ← IPv4 của Supabase
  port: 5432,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
