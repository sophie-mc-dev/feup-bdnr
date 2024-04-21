const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/', UserController.loginUser);

// profile route
router.get('/:user_id', UserController.getUserById);

module.exports = router;
