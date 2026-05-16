const express = require('express');
const router = express.Router();
const { getPlayerCollection } = require('../controllers/collectionController');

router.get('/player/:playerId', getPlayerCollection);

module.exports = router;