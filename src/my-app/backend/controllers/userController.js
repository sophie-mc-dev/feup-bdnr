const { connectToCouchbase } = require('../db/connection');
const uuid = require('uuid');

// login user
async function loginUser(req, res) {
    if (!req.body.email && !req.body.password) {
        return res.status(401).send({ "message": "An `email` and `password` are required" })
    } else if (!req.body.email || !req.body.password) {
        return res.status(401).send({ 
          "message": `A ${!req.body.email ? '`email`' : '`password`'} is required`
        })
    }

    const query = 'SELECT * FROM `users` WHERE email = $1 AND password = $2 OR username = $1 AND password = $2';
    const params = [req.body.email, req.body.password];
    const { usersCollection } = await connectToCouchbase();

    try {
        const result = await usersCollection.query(query, { parameters: params });
        if (!result.rows.length) {
            return res.status(401).send({ "message": "Invalid email/username or password" })
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// register user
async function registerUser(req, res) {
    if (!req.body.email && !req.body.password) {
        return res.status(401).send({ "message": "An `email` and `password` are required" })
    } else if (!req.body.email || !req.body.password) {
        return res.status(401).send({ 
          "message": `A ${!req.body.email ? '`email`' : '`password`'} is required`
        })
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

    const { usersCollection } = await connectToCouchbase();

    try{
        await usersCollection.upsert('new_user', user);
        res.json(user);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }


}

// get user profile
async function getUserById(req, res) {
    let userId = req.params.user_id;
    const { usersCollection } = await connectToCouchbase();

    try {
        const result = await usersCollection.get(userId);
        if (!result) {
            res.status(404).send('User not found');
        } else {
            res.json(result.value);
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