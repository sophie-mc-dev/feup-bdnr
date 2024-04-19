const couchbase = require('couchbase');

const clusterConnStr = 'couchbase://localhost';
const username = 'Administrator';
const password = 'password';
const bucketName = 'event_shop';

(async () => {
    try {
        const cluster = await couchbase.connect(clusterConnStr, {
            username: username,
            password: password,
        });

        const bucket = cluster.bucket(bucketName);

        console.log('Connected to Couchbase Server');

        const artistsCollection = bucket.defaultScope().collection('artists');
        const categoriesCollection = bucket.defaultScope().collection('categories');
        const eventsCollection = bucket.defaultScope().collection('events');
        const locationsCollection = bucket.defaultScope().collection('locations');
        const transactionsCollection = bucket.defaultScope().collection('transactions');
        const usersCollection = bucket.defaultScope().collection('users');

        module.exports = {
            usersCollection
        };
    } catch (error) {
        console.error('Error connecting to Couchbase:', error);
        process.exit(1); // Exit process if connection fails
    }
})();
