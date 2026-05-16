const express = require('express');
const { getDailyHeist, submitDailyHeist } = require('../controllers/dailyHeistController');
const { validateHeistSubmit } = require('../middleware/validateRequest');
const { submitRateLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.get('/', getDailyHeist);
router.post('/submit', submitRateLimiter, validateHeistSubmit, submitDailyHeist);

module.exports = router;
