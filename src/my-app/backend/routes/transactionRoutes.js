const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController')

// Purchase history of a specific user
router.get('/purchases/:user_id', TransactionController.getPurchasesByUserId);

// Shopping cart of a specific user
router.get('/shopping_cart/:user_id', TransactionController.getShoppingCartByUserId);

// Tickets of a specific user
router.get('/tickets/:user_id', TransactionController.getTicketsByUserId);

module.exports = router;