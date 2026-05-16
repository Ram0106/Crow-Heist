const express = require('express');
const router = express.Router();
const {
  getAchievements,
  getPlayerAchievementsHandler,
  unlockAchievement
} = require('../controllers/achievementController');

router.get('/', getAchievements);
router.get('/player/:playerId', getPlayerAchievementsHandler);
router.post('/unlock', unlockAchievement);

module.exports = router;