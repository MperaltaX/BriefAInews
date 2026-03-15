const News = require('../models/News');

/**
 * Service to execute MongoDB queries for News
 * @param {Object} filters
 * @param {string} [filters.country] - Optional country to filter by
 * @returns {Promise<Array<Object>>} Resolved with the array of news objects
 */
const fetchNews = async ({ country }) => {
    // Start with an empty query
    const query = {};

    // Validate and use the country filter if present
    if (country) {
        // According to requirements: "Mundo", "Argentina", "Mexico", "Brasil", "Estados Unidos"
        query.country = country;
    }

    // Fetch the news, sorted by published_time in descending order (newest first)
    const news = await News.find(query).sort({ published_time: -1 }).lean();

    return news;
};

/**
 * Aggregation service to fetch headline news grouped by portal.
 * Each portal returns up to 56 articles sorted by published_time (newest first).
 * @returns {Promise<Array<{portal: string, articles: Array<Object>}>>}
 */
const fetchNewsByPortals = async () => {
    const pipeline = [
        { $match: { headline: true } },
        { $sort: { published_time: -1 } },
        {
            $group: {
                _id: '$portal',
                articles: { $push: '$$ROOT' }
            }
        },
        {
            $project: {
                _id: 0,
                portal: '$_id',
                articles: { $slice: ['$articles', 56] }
            }
        },
        { $sort: { portal: 1 } }
    ];

    const results = await News.aggregate(pipeline);
    return results;
};

module.exports = {
    fetchNews,
    fetchNewsByPortals
};
