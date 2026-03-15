const newsService = require('../services/news.service');

/**
 * Controller to handle retrieving news
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getNews = async (req, res, next) => {
    try {
        const { country } = req.query;

        // Call the service to get the news
        const news = await newsService.fetchNews({ country });

        // Respond with JSON
        res.status(200).json({
            success: true,
            count: news.length,
            data: news
        });
    } catch (error) {
        // Pass to the global error handler
        next(error);
    }
};

/**
 * Controller to handle retrieving news grouped by portals
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getNewsByPortals = async (req, res, next) => {
    try {
        const portals = await newsService.fetchNewsByPortals();

        res.status(200).json({
            success: true,
            count: portals.length,
            data: portals
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNews,
    getNewsByPortals
};
