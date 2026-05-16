const express = require('express');
const { getDailyLeaderboard, getGlobalLeaderboard } = require('../controllers/leaderboardController');

const router = express.Router();

router.get('/daily', getDailyLeaderboard);
router.get('/global', getGlobalLeaderboard);

module.exports = router;
