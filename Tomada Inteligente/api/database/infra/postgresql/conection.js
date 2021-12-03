require('dotenv').config()
const { Pool: Conection } = require('pg')

module.exports = new Conection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_BASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
})