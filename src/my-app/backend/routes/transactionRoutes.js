const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController')

// Upcoming events (homepage)
router.get('/purchases/:user_id', TransactionController.getPurchasesByUserId);

// Filtered events
router.get('/shopping_cart/:user_id', TransactionController.getShoppingCartByUserId);

module.exports = router;