const couchbase = require('couchbase')
const express = require('express')
const uuid = require('uuid')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const clusterConnStr = 'couchbase://localhost'
const username = 'Administrator'
const password = 'password'
const bucketName = 'event_shop'

const cluster = await couchbase.connect(clusterConnStr, {
  username: username,
  password: password,
})

const bucket = cluster.bucket(bucketName)
const collection = bucket.defaultScope().collection('events')

const server = app.listen(3000, () => console.info(`Running on port ${server.address().port}...`))