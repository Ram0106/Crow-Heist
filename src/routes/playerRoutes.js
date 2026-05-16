const express = require('express');
const { registerPlayer, getPlayer } = require('../controllers/playerController');
const { requireFields, validateObjectIdField } = require('../middleware/validateRequest');

const router = express.Router();

router.post('/register', requireFields(['username']), registerPlayer);
router.get('/:id', validateObjectIdField('id'), getPlayer);

module.exports = router;
