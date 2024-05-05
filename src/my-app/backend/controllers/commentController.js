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

async function addComment(req, res) {

    const { event_id, user_id, text } = req.body;
    const id = uuid.v4();
    const comment = {
        "comment_id": id,
        "event_id": event_id,
        "user_id": user_id,
        "text": text,
        "date": new Date().toISOString()
    }

    try {
        const { bucket } = await connectToCouchbase();
        const commentsCollection = bucket.defaultScope().collection('comments');
        await commentsCollection.upsert(id, comment);
        res.json({comment});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }

}


module.exports = {
    getCommentsByEventId, 
    getCommentsByUserId,
    addComment
};