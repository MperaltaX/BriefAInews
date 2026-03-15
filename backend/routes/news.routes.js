const express = require('express');
const { getNews, getNewsByPortals } = require('../controllers/news.controller');

const router = express.Router();

/**
 * GET /api/news/portals
 * Route to retrieve headline news grouped by portal
 */
router.get('/portals', getNewsByPortals);

/**
 * GET /api/news
 * Route to retrieve list of news articles optionally filtered by country
 */
router.get('/', getNews);

module.exports = router;
