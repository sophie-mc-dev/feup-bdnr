const express = require('express');
const cors = require('cors')
const userRoute = require("./routes/userRoutes")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  console.log(`Received request for: ${req.originalUrl}`)
  res.status(404).send('Not Found')
})

app.use('/users', userRoute);

module.exports.app = app;
