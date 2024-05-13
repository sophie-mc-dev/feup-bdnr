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


// events of a specific artist
router.get('/artists/:artist_id', EventController.getEventsByArtistId);

// get total income of a specific event
router.get('/income/:event_id', EventController.getTotalIncome);

// get revenue by ticket type of a specific event
router.get('/revenue_by_type/:event_id', EventController.getRevenueByTicketType);

// get total tickets sold of a specific event
router.get('/tickets_sold/:event_id', EventController.getNumberOfTicketsSold);

// get tickets sold by ticket type of a specific event
router.get('/tickets_sold_by_type/:event_id', EventController.getNumberOfTicketsSoldByTicketType);




module.exports = router;

