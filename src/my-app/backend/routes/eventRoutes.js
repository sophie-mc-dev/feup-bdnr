const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController')

// Upcoming events (homepage)
router.get('/', EventController.getUpcomingEvents);

// event Page
router.get('/:event_id', EventController.getEventById);

// Filtered events
router.get('/filter', EventController.filterAndOrderEvents);

module.exports = router;
