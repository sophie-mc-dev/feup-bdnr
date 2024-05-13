const couchbase = require('couchbase');

// Initialize Couchbase connection
const clusterConnStr = 'couchbase://localhost';
const username = 'Administrator';
const password = 'password';
const bucketName = 'event_shop';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.couchbase

if (!cached) {
  cached = global.couchbase = { conn: null }
}

async function createCouchbaseCluster(){
    if (cached.conn){
        return cached.conn
    }

    cached.conn = await couchbase.connect(clusterConnStr, {
        username: username,
        password: password,
    });

    return cached.conn;
}

async function connectToCouchbase() {

  const cluster = await createCouchbaseCluster();

  const bucket = cluster.bucket(bucketName);
  const artistsCollection = bucket.defaultScope().collection('artists');
  const categoriesCollection = bucket.defaultScope().collection('categories');
  const eventsCollection = bucket.defaultScope().collection('events');
  const locationsCollection = bucket.defaultScope().collection('locations');
  const transactionsCollection = bucket.defaultScope().collection('transactions');
  const usersCollection = bucket.defaultScope().collection('users');

  return {
    couchbase,
    cluster,
    bucket,
    artistsCollection,
    categoriesCollection,
    eventsCollection,
    locationsCollection,
    transactionsCollection,
    usersCollection
  };
}

module.exports = {
    connectToCouchbase
};
