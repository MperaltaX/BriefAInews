const mongoose = require('mongoose');

/**
 * @typedef {Object} INews
 * @property {number} id_article - Source ID for the article
 * @property {string} portal - Tge news portal or source name
 * @property {string} title - The title of the news
 * @property {string|null} ai_title - AI generated title variations
 * @property {string} content - Full content of the article
 * @property {string|null} ai_content - AI summarized content
 * @property {string} excerpt - Short summary
 * @property {string|null} ai_excerpt - AI generated excerpt
 * @property {string} url - Original article URL
 * @property {string|Object} image_url - URL string or an object containing an array of URLs
 * @property {string} category - Article category
 * @property {string[]} tags - Related tags
 * @property {number} importance - Article importance level
 * @property {string} country - The country of the news (e.g. Mundo, Argentina, Mexico, Brasil, Estados Unidos)
 * @property {boolean} headline - Whether this is a headline or breaking news
 * @property {Date} published_time - Standard ISO date representation
 */

/**
 * Schema representing the shape of `scrap_news_content`
 */
const NewsSchema = new mongoose.Schema({
    id_article: { type: Number, required: true },
    portal: { type: String, required: true },
    title: { type: String, required: true },
    ai_title: { type: String, default: null },
    content: { type: String, required: true },
    ai_content: { type: String, default: null },
    excerpt: { type: String, required: true },
    ai_excerpt: { type: String, default: null },
    url: { type: String, required: true },
    // Use schema type 'Mixed' for image_url since it can be either a String or an Object
    image_url: { type: mongoose.Schema.Types.Mixed, required: true },
    category: { type: String },
    tags: { type: [String], default: [] },
    importance: { type: Number, default: 0 },
    country: { type: String },
    headline: { type: Boolean, default: false },
    published_time: { type: Date, required: true }
}, {
    timestamps: false,
    versionKey: false
});

/**
 * The 'News' model bound to the 'scrap_news_content' collection.
 * Default mongoose behaviour pluralizes names, but since we are specifying it, it maps directly.
 */
const News = mongoose.model('News', NewsSchema, 'scrap_news_content');

module.exports = News;
