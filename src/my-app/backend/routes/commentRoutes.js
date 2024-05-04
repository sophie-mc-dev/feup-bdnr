const express = require('express');
const router = express.Router();
const CommentsController = require('../controllers/commentController');

// Retrieve comments of an event
router.get('/events/:event_id', CommentsController.getCommentsByEventId);

// Retrieve comments of a specific user
router.get('/users/:user_id', CommentsController.getCommentsByUserId);

module.exports = router;
