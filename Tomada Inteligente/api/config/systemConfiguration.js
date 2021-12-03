const express = require('express')
const consign = require('consign')
const cors = require('cors')
const bodyParser = require('body-parser')

module.exports = () => {
  const app = express()
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  consign()
    .include('app/controllers')
    .into(app)

  return app
}