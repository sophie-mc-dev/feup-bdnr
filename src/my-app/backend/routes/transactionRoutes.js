const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController')

// Purchase history of a specific user
router.get('/purchases/:user_id', TransactionController.getPurchasesByUserId);

// Shopping cart of a specific user
router.get('/shopping_cart/:user_id', TransactionController.getShoppingCartByUserId);

// Delete item from shopping cart
router.delete('/shopping_cart/:user_id/:item_id', TransactionController.deleteItemFromCart);

// Update shopping cart item quantity
router.put('/shopping_cart/:user_id/:item_id', TransactionController.updateCartItemQuantity);

// Delete all items from shopping cart
router.delete('/shopping_cart/:user_id', TransactionController.deleteShoppingCart);

// Upcoming tickets of a specific user
router.get('/tickets/upcoming/:user_id', TransactionController.getUpcomingTicketsByUserId);

// Past tickets of a specific user
router.get('/tickets/past/:user_id', TransactionController.getPastTicketsByUserId);

module.exports = router;