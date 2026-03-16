const aiService = require('../services/ai.service');
const News = require('../models/News');

/**
 * Controller to handle AI summary generation
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getSummary = async (req, res, next) => {
    try {
        const { content, id_article } = req.body;

        if (!content || !id_article) {
            return res.status(400).json({
                success: false,
                message: 'Content and id_article parameters are required'
            });
        }

        // Check if the article already has an AI summary
        const article = await News.findOne({ id_article });

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        if (article.ai_content) {
            return res.status(200).json({
                success: true,
                data: article.ai_content
            });
        }

        // Generate summary if it doesn't exist
        const summary = await aiService.generateSummary(content);

        // Save the generated summary to the database
        article.ai_content = summary;
        await article.save();

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSummary
};
