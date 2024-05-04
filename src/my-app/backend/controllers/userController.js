const { connectToCouchbase } = require('../db/connection');
const uuid = require('uuid');

// login user
async function loginUser(req, res) {
    const query = 'SELECT * FROM users WHERE (username = $1 AND `password` = $2) OR (email = $1 AND `password` = $2)';
    const params = {parameters: [req.body.username, req.body.password]};

    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.scope('_default').query(query, params);
        if (!result.rows.length) {
            res.json({ "error": "Invalid username or password" });
        }
        else {
            res.json(result.rows[0].users);
        }
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// register user
async function registerUser(req, res) {
    // verify if username or email already exists
    const query = 'SELECT * FROM users WHERE username = $1 OR email = $2';
    let params = [req.body.username, req.body.email];

    console.log(req.body);

    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.scope('_default').query(query, {
            parameters: params
        });
        if (result.rows.length) {
            return res.json({ "error":  "Username or email already exists" })
        }

        const id = uuid.v4()
        const user = {
            "user_id": id,
            "name": req.body.name,
            "username": req.body.username,
            "email": req.body.email,
            "password": req.body.password,
            "is_organization": req.body.is_organization || false,
            "liked_events": [],
        }

        const usersCollection = bucket.scope('_default').collection('users');
        await usersCollection.upsert(id , user);
        res.json({user_id: id, is_organization: user.is_organization});
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// get user profile
async function getUserById(req, res) {
    let userId = req.params.user_id;
    const query = 'SELECT name, username, email FROM users WHERE user_id = $1';
    const params = {parameters: [userId]};

    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.scope('_default').query(query, params);
        if (!result) {
            res.status(404).send('User not found');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    loginUser,
    registerUser,
    getUserById
};