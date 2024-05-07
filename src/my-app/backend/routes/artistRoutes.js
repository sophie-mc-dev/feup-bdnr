const express = require('express');
const router = express.Router();
const ArtistController = require('../controllers/artistController')

// Get info of all artists
router.get('/', ArtistController.getAllArtists);

// Get the name of all artists
router.get('/names', ArtistController.getNames);

module.exports = router;

