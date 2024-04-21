const couchbase = require('couchbase');

async function connectToCouchbase() {
  // Initialize Couchbase connection
  const clusterConnStr = 'couchbase://localhost';
  const username = 'Administrator';
  const password = 'password';
  const bucketName = 'event_shop';

  const cluster = await couchbase.connect(clusterConnStr, {
    username: username,
    password: password,
  });

  const bucket = cluster.bucket(bucketName);
  const artistsCollection = bucket.defaultScope().collection('artists');
  const categoriesCollection = bucket.defaultScope().collection('categories');
  const eventsCollection = bucket.defaultScope().collection('events');
  const locationsCollection = bucket.defaultScope().collection('locations');
  const transactionsCollection = bucket.defaultScope().collection('transactions');
  const usersCollection = bucket.defaultScope().collection('users');

  return {
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
