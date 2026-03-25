const express = require('express');
const Template = require('../models/Template');

const router = express.Router();

/**
 * GET /api/templates/latest/:name
 * Route to retrieve the latest data for a specific template
 */
router.get('/latest/:name', async (req, res, next) => {
    try {
        const { name } = req.params;
        const latestTemplate = await Template.findOne({ template_name: name })
            .sort({ created_at: -1 })
            .lean();

        if (!latestTemplate) {
            return res.status(404).json({
                success: false,
                message: `Template '${name}' not found`
            });
        }

        res.status(200).json({
            success: true,
            data: latestTemplate.data,
            created_at: latestTemplate.created_at
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
