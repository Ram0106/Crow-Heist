const express = require('express');
const { startHeist, submitHeist } = require('../controllers/heistController');
const { requireFields, validateHeistSubmit } = require('../middleware/validateRequest');
const { submitRateLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/start', requireFields(['player_id', 'level_number']), startHeist);
router.post('/submit', submitRateLimiter, validateHeistSubmit, submitHeist);

module.exports = router;
