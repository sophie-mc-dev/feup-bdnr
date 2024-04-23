const express = require('express');
const cors = require('cors')
const eventRoute = require("./routes/eventRoutes")
const categoryRoute = require("./routes/categoryRoutes")
const locationRoute = require("./routes/locationRoutes")
const artistRoute = require("./routes/artistRoutes")
const userRoute = require("./routes/userRoutes")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  console.log(`Received request for: ${req.originalUrl}`)
  res.status(404).send('Not Found')
})

app.use('/events', eventRoute);

app.use('/categories', categoryRoute);

app.use('/locations', locationRoute);

app.use('/artists', artistRoute);

app.use('/users', userRoute);

module.exports.app = app;
