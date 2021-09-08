// this is the information used by express and node.js to access the PostGreSQL database.

const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.POSTGRES_HEROKU_USER,
  password: process.env.POSTGRES_HEROKU_PASSWORD,
  host: process.env.POSTGRES_HEROKU_HOST,
  port: 5432,
  database: process.env.POSTGRES_HEROKU_DATABASE,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
