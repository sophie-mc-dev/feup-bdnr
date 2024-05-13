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

// like event
router.put('/like/', UserController.likeEvent);

// dislike event
router.delete('/dislike/', UserController.dislikeEvent);

router.get('/total_income/:user_id', UserController.getTotalIncome);

router.get('/best_selling_event/:user_id', UserController.getBestSellingEventByOrganizationId);

router.get('/total_hosted_events/:user_id', UserController.getTotalEventsHostedByOrganizationId);

router.get('/total_tickets_per_type/:user_id', UserController.getTotalTicketsPerTypePerOrganizationId);

router.get('/total_revenue_per_ticket_type/:user_id', UserController.getTotalRevenueByTicketType);

router.get('/get_revenue_from_range_date/:user_id', UserController.getIncomeFromRangeDate);

router.get('/get_tickets_sold_from_range_date/:user_id', UserController.getTicketsSoldFromRangeDate);

module.exports = router;