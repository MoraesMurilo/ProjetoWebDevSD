// Configura a conexão com o banco de dados PostgreSQL usando variáveis de ambiente
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
module.exports = { query: (text, params) => pool.query(text, params) };

