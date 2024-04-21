const { connectToCouchbase } = require('../db/connection');

async function getAllCities(req, res) {
    const query = 'SELECT city_name FROM `locations`';

    try {
        const { bucket } = await connectToCouchbase();
        console.log("hello")
        const result = await bucket.scope("_default").query(query);
        res.json(result.rows.map(row => row.city_name));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getAllCities
};