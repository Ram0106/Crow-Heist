const express = require('express');
const router = express.Router();
const { getPlayerLevelResults } = require('../controllers/levelResultController');

router.get('/player/:playerId', getPlayerLevelResults);

module.exports = router;