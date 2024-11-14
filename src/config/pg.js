const { Client } = require('pg');
const pg = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: '5432',
    database: 'postgres',
  });

pg.connect()

async function getCoordinates() {
    const query = 'SELECT * FROM hotels'
    const result = await pg.query(query)
    return result.rows
  }

module.exports = {getCoordinates}

