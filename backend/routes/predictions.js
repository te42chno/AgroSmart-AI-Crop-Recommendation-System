const express = require('express');
const auth = require('../middleware/auth');
const { predict, getHistory } = require('../controllers/predictionController');

const router = express.Router();

router.post('/predict', auth, predict);
router.get('/history', auth, getHistory);

module.exports = router;
