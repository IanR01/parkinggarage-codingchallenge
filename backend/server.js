require('dotenv').config()

const express = require('express')
const { Sequelize } = require('sequelize')

const parkingSessionRoutes = require('./routes/parking-session')

// express app
const app = express()

// middleware
app.use(express.json())

// log requests
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/parking-sessions', parkingSessionRoutes)

// connect to database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
)

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to database.')
  
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log(`Example app listening on port ${process.env.PORT}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

startServer()