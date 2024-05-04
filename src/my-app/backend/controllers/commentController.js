const { connectToCouchbase } = require('../db/connection');


async function getCommentsByEventId(req, res) {
    const event_id = req.params.event_id;
    const query = 'SELECT RAW comments FROM comments WHERE event_id = $1';
    const options = {parameters: [event_id]}

    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.defaultScope().query(query, options);
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getCommentsByUserId(req, res) {
    const user_id = req.params.user_id;
    const query = 'SELECT RAW comments FROM comments WHERE user_id = $1';
    const options = {parameters: [user_id]}

    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.defaultScope().query(query, options);
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getCommentsByEventId, 
    getCommentsByUserId
};