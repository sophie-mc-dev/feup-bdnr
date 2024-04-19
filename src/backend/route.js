const express = require('express');
const passport = require('./auth');
const collection = require('./app');
const router = express.Router();

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    const user = {
        name,
        email,
        password
    };

    collection.upsert(email, user);

    res.send('User registered');
});

module.exports = router;