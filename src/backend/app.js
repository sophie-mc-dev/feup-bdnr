const couchbase = require('couchbase')

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


const collection = bucket.defaultCollection();

module.exports = collection;
