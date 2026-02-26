require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({

    /*
host:process.env.DB_HOST,
port:process.env.DB_PORT,

user:process.env.DB_USER,
password:process.env.DB_PASSWORD,

database:process.env.DB_NAME,
*/
host: "database-1.chmgqe0e2heu.ap-south-1.rds.amazonaws.com",
  port: 5432,
  user: "postgres",
  password: "Aadhav123!",
  database: "postgres",
ssl:{
rejectUnauthorized:false
}

});

module.exports = pool;