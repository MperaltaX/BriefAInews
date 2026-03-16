const express = require('express');
const { getSummary } = require('../controllers/ai.controller');

const router = express.Router();

/**
 * POST /api/ai/summary
 * Route to generate a summary for a given content
 */
router.post('/summary', getSummary);

module.exports = router;
