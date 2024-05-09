const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Add new user
router.post('/register', UserController.registerUser);

// Update user
router.put('/', UserController.updateUser);

// Delete user
router.delete('/', UserController.deleteUser);

// Verify user credentials
router.post('/login', UserController.loginUser);

// profile route
router.get('/:user_id', UserController.getUserById);



module.exports = router;