const { connectToCouchbase } = require('../db/connection');
const uuid = require('uuid');

async function getCommentsByEventId(req, res) {
    const event_id = req.params.event_id;
    const query = `SELECT u.name as user_name, u.user_id, c.*
    FROM users AS u
    UNNEST u.comments AS c
    WHERE c.event_id = $1
    ORDER BY MILLIS(c.date) DESC`;
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
    const query = 'SELECT raw comments as c FROM users WHERE user_id = $1 ORDER BY MILLIS(c.date) DESC';
    const options = {parameters: [user_id]}

    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.defaultScope().query(query, options);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function addComment(req, res) {
    const { date, text, event_id, event_name, user_id } = req.body;
    const id = uuid.v4();
    const new_comment = {
        "comment_id": id,
        "date": date,
        "text": text,
        "event_id": event_id,
        "event_name": event_name,
    }

    try {
        const { bucket } = await connectToCouchbase();
        const usersCollection = bucket.scope('_default').collection('users');
        const result = await usersCollection.get(user_id);
        const document = result.content;

        if (document.comments) {
            document.comments.push(new_comment);
        } else {
            document.comments = [new_comment];
        }

        const response = await usersCollection.upsert(user_id, document);
        res.json(new_comment);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}

async function deleteComment(req, res) {
    const { comment_id, user_id} = req.query;

    const query = `
        UPDATE users 
        SET comments = ARRAY_REMOVE(comments, comments[$1]) 
        WHERE user_id = $2
    `;
    let options;

    try {
        const { bucket } = await connectToCouchbase();
        const usersCollection = bucket.scope('_default').collection('users');
        const result = await usersCollection.get(user_id);
        const document = result.content;
        
        const commentIndex = document.comments.findIndex(comment => comment.comment_id === comment_id);
        
        if (commentIndex !== -1) {
            options = { parameters: [commentIndex, user_id] };
            await bucket.defaultScope().query(query, options);
            res.json({ message: 'Comment deleted' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}

async function editComment(req, res) {
    const { comment_id, user_id, text} = req.body;

    const query = `
        UPDATE users 
        SET comments[$1].text = $2 
        WHERE user_id = $3
        RETURNING comments
    `;
    let options;

    try {
        const { bucket } = await connectToCouchbase();
        const usersCollection = bucket.scope('_default').collection('users');
        const result = await usersCollection.get(user_id);
        const document = result.content;
        
        const commentIndex = document.comments.findIndex(comment => comment.comment_id === comment_id);

        if (commentIndex !== -1) {
            options = { parameters: [commentIndex, text, user_id] };
            await bucket.defaultScope().query(query, options);
            
            return res.json({ message: 'Comment updated' });
        }
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