const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const newsRoutes = require('./routes/news.routes');
const authRoutes = require('./routes/auth.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
// CORS is critical to allow Next.js app on port 3000 to requests resources here
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Main Root Route
app.get('/', (req, res) => {
  res.json({ message: 'BriefAInews API is running' });
});

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use(errorHandler);

// Database connection & Server initialization
const startServer = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb+srv://digital:d3partament0BI@edn.szgrd.mongodb.net/5dias_web?retryWrites=true&w=majority';
        await mongoose.connect(mongoUri, {
            dbName: 'sistema'
        });
        console.log('Successfully connected to MongoDB.');
        
        app.listen(PORT, () => {
            console.log(`Backend service running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB database:', error.message);
        process.exit(1);
    }
};

startServer();
