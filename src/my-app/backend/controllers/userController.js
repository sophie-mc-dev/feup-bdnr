const { connectToCouchbase } = require('../db/connection');

// login user
async function loginUser(req, res) {} //TODO

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
    getUserById
};