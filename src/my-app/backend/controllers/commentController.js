const { connectToCouchbase } = require('../db/connection');
const uuid = require('uuid');


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
    const { event_id, user_id, user_name ,text } = req.body;
    const id = uuid.v4();
    const comment = {
        "comment_id": id,
        "event_id": event_id,
        "user_id": user_id,
        "user_name": user_name,
        "text": text,
    }

    try {
        const { bucket } = await connectToCouchbase();
        const commentsCollection = bucket.scope('_default').collection('comments');
        await commentsCollection.upsert(id, comment);
        res.json({comment});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}

async function deleteComment(req, res) {
    const comment_id = req.params.comment_id;
    try {
        const { bucket } = await connectToCouchbase();
        const commentsCollection = bucket.scope('_default').collection('comments');
        await commentsCollection.remove(comment_id);
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}

async function editComment(req, res) {
    const comment_id = req.params.comment_id;
    const text = req.body.text;
    try {
        const { bucket } = await connectToCouchbase();
        const commentsCollection = bucket.scope('_default').collection('comments');
        const result = await commentsCollection.get(comment_id);
        const comment = result.value;
        comment.text = text;
        await commentsCollection.upsert(comment_id, comment);
        res.json({ message: 'Comment updated' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}


module.exports = {
    getCommentsByEventId, 
    getCommentsByUserId,
    addComment,
    deleteComment,
    editComment
};