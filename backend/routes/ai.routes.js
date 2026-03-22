const express = require('express');
const { getSummary, getDailyAudio } = require('../controllers/ai.controller');

const router = express.Router();

/**
 * POST /api/ai/summary
 * Route to generate a summary for a given content
 */
router.post('/summary', getSummary);

/**
 * GET /api/ai/daily-audio
 * Route to get or generate the daily audio summary
 */
router.get('/daily-audio', getDailyAudio);

module.exports = router;
