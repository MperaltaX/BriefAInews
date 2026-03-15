const express = require('express');
const { register, login, forgotPassword, resetPassword, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
router.post('/login', login);

/**
 * POST /api/auth/forgot-password
 * Send password reset email via Brevo
 */
router.post('/forgot-password', forgotPassword);

/**
 * POST /api/auth/reset-password
 * Reset password using a valid token
 */
router.post('/reset-password', resetPassword);

/**
 * GET /api/auth/me
 * Get current authenticated user data (protected)
 */
router.get('/me', protect, getMe);

module.exports = router;
