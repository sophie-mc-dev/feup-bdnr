const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController')

// Upcoming events (homepage)
router.get('/', EventController.getUpcomingEvents);

// Filtered events
router.get('/filter', EventController.filter);

// event Page
router.get('/:event_id', EventController.getEventById);

// liked events by specific user
router.get('/favorites/:user_id', EventController.getLikedEventsByUserId);

module.exports = router;

