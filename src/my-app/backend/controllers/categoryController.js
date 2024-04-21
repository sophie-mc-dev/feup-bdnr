const { connectToCouchbase } = require('../db/connection');

async function getAllCategories(req, res) {
    const query = 'SELECT category_name FROM `categories`';

    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.scope("_default").query(query);
        res.json(result.rows.map(row => row.category_name));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getAllCategories
};