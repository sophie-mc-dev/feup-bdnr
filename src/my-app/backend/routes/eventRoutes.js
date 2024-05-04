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

// past events of a specific organization id
router.get('/my_events/past/:user_id', EventController.getPastEventsByOrganizationId);

// upcoming events of a specific organization id
router.get('/my_events/upcoming/:user_id', EventController.getUpcomingEventsByOrganizationId);


module.exports = router;

