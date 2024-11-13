const { Client } = require('pg');
const pg = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: '5432',
    database: 'postgres',
  });

module.exports = pg