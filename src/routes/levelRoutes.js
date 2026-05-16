const express = require('express');
const { getAvailableLevels } = require('../controllers/levelController');

const router = express.Router();

router.get('/', getAvailableLevels);

module.exports = router;
