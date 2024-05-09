const { connectToCouchbase } = require('../db/connection');
const uuid = require('uuid');

// login user
async function loginUser(req, res) {
    const query = 'SELECT user_id,  is_organization, username, name FROM users WHERE (username = $1 AND `password` = $2) OR (email = $1 AND `password` = $2)';
    const params = {parameters: [req.body.username.toLowerCase(), req.body.password]};

    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.scope('_default').query(query, params);
        if (!result.rows.length) {
            res.json({ "error": "Invalid username or password" });
        }
        else {
            res.json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// register user
async function registerUser(req, res) {
    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        return res.json({ "error": "Invalid email format" });
    }

    // verify if username or email already exists
    const query = 'SELECT * FROM users WHERE username = $1 OR email = $2';
    let params = [req.body.username.toLowerCase(), req.body.email.toLowerCase()];
    
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
            "username": req.body.username.toLowerCase(),
            "email": req.body.email.toLowerCase(),
            "password": req.body.password,
            "is_organization": req.body.is_organization || false,
            "liked_events": [],
            "comments": []
        }

        const usersCollection = bucket.scope('_default').collection('users');
        await usersCollection.upsert(id , user);
        res.json({user_id: id, is_organization: user.is_organization, username: user.username,
            name: user.name
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// update user
async function updateUser(req, res) {
    const { user_id, name, username, email, password } = req.body;

    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.json({ "error": "Invalid email format" });
    }

    const query1 = 'SELECT * FROM users WHERE (username = $1 OR email = $2) AND user_id != $3';
    const params1 = [username.toLowerCase(), email.toLowerCase(), user_id];

    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.scope('_default').query(query1, {
            parameters: params1
        });
        if (result.rows.length) {
            return res.json({ "error":  "Username or email already exists" })
        }

        let query_update = 'UPDATE users SET name = $1, username = $2, email = $3';
        let params = [name, username.toLowerCase(), email.toLowerCase()];

        if (password !== '') {
            params.push(password);
            query_update += ', password = $' + params.length;
        }

        params.push(user_id);
        query_update += ' WHERE user_id = $' + params.length;

        await bucket.scope('_default').query(query_update, {
            parameters: params
        });
        res.json({ "message": "User updated successfully" });

    } catch (error) {
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

// delete user by id
async function deleteUser(req, res) {
    let user_id = req.body.user_id;
    const query_delete_user = 'DELETE FROM users WHERE user_id = $1'; 
    const query_delete_transactions = 'DELETE FROM transactions WHERE user_id = $1';
    const params = {parameters: [user_id]};

    try {
        const { bucket } = await connectToCouchbase();
        const result1 = await bucket.scope('_default').query(query_delete_transactions, params);
        const result2 = await bucket.scope('_default').query(query_delete_user, params);
        res.json({ "message": "User deleted successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {
    loginUser,
    registerUser,
    getUserById, 
    updateUser, 
    deleteUser
};