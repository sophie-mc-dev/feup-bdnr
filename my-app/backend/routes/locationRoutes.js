const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/locationController')

// Retrieve all cities
router.get('/', LocationController.getAllCities);

module.exports = router;
