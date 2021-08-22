// this is the information used by express and node.js to access the PostGreSQL database.

const Pool = require("pg").Pool;

const pool = new Pool({
  user: "dabvggdydcesys",
  password: "a5c2f47518fab233ca4d353b0147e28e7e3362fdbe36a26e4d4fc3b1c42b4c9f",
  host: "ec2-18-235-4-83.compute-1.amazonaws.com",
  port: 5432,
  database: "dd7gfm3vgtkv3t",
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
