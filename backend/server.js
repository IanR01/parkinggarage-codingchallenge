const express = require('express')
const port = 3000
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


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})