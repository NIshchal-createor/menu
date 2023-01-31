const { Pool } = require("pg"); //poatgres library for express
require("dotenv").config();
const pool = new Pool({
  //this configuration has to be done from pgadmin
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});
pool.connect(function (err, b) {
  if (err) throw err;
  console.log("connected");
});
//pool.query('select * from users').then((e)=>{console.log(e.rows)})
module.exports = { pool };
