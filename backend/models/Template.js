const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
    template_name: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    created_at: { type: Date, default: Date.now }
}, {
    timestamps: false,
    versionKey: false
});

// Map to the 'newspaper_templates' collection in 'ai_news' database
const Template = mongoose.model('Template', TemplateSchema, 'newspaper_templates');

module.exports = Template;
