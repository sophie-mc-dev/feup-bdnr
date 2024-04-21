const express = require('express');
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//app.use('/api', require('./routes/userRoutes'))

app.get('/', (req, res) => {
  console.log(`Received request for: ${req.originalUrl}`)
  res.status(404).send('Not Found')
})

module.exports.app = app;


/*
async function main() {
  // For a secure cluster connection, use `couchbases://<your-cluster-ip>` instead.
  const clusterConnStr = 'couchbase://localhost'
  const username = 'Administrator'
  const password = 'password'
  const bucketName = 'event_shop'

  const cluster = await couchbase.connect(clusterConnStr, {
    username: username,
    password: password,
  })

  const bucket = cluster.bucket(bucketName)

  // Get a reference to the default collection, required only for older Couchbase server versions
  //const defaultCollection = bucket.defaultCollection()

  console.log('Connected to Couchbase Server')


  const usersCollection = bucket.defaultScope().collection('users')



  
  const event = {
    event_id: 200000,
    event_name: "Musical of my life",
    date: "2024-02-22T03:46:46.749933",
    address: "64375 Logan Springs\nSanchezfort, WI 17911",
    description: "It was very cool :)",
    organization_id: 1680,
    categories: [
        "Car Show",
        "Business Summit"
    ],
    location: "Abu Dhabi",
    ticket_types: [],
    comments: [],
    artists: [
        "Ariana Grande",
        "The Academy Is..."
    ]
  }

  await collection.upsert('cool_event', event)

  let getResult = await collection.get('cool_event')
    
  console.log('Got Result:', getResult.value)

  const queryResult = await bucket
  .scope('_default')
  .query('SELECT event_name FROM `events`', {
    parameters: ['Ariana Grande'],
  })

  console.log('Query Result:')
  queryResult.rows.forEach((row) => {
    console.log(row)
  })

}

// Run the main function
main()
  .catch((err) => {
    console.log('ERR:', err)
    process.exit(1)
  })
  .then(process.exit)
*/