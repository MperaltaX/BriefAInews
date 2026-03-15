const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generates a signed JWT for a given user ID.
 * @param {string} userId - The MongoDB _id of the user
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

/**
 * Registers a new user in the database.
 * @param {Object} params
 * @param {string} params.name - User's full name
 * @param {string} params.email - User's email
 * @param {string} params.password - Plain text password (will be hashed by the model)
 * @returns {Promise<{user: IUser, token: string}>} Created user (without password) and JWT
 */
const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('Ya existe una cuenta con este email');
        error.statusCode = 400;
        throw error;
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        token
    };
};

/**
 * Authenticates a user with email and password.
 * @param {Object} params
 * @param {string} params.email - User's email
 * @param {string} params.password - Plain text password
 * @returns {Promise<{user: IUser, token: string}>} Authenticated user data and JWT
 */
const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken(user._id);

    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        token
    };
};

/**
 * Generates a password reset token, stores it in the DB, and sends a reset email via Brevo.
 * @param {string} email - The email of the user requesting password reset
 * @returns {Promise<void>}
 */
const generateResetToken = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('No existe una cuenta con este email');
        error.statusCode = 404;
        throw error;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendResetEmail(user.email, user.name, resetUrl);
};

/**
 * Resets the user's password using a valid reset token.
 * @param {Object} params
 * @param {string} params.token - The plain reset token from the URL
 * @param {string} params.newPassword - The new plain text password
 * @returns {Promise<void>}
 */
const resetPassword = async ({ token, newPassword }) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
        const error = new Error('Token inválido o expirado');
        error.statusCode = 400;
        throw error;
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
};

/**
 * Sends a password reset email using the Brevo Transactional Email API.
 * @param {string} toEmail - Recipient email address
 * @param {string} toName - Recipient name
 * @param {string} resetUrl - Full URL with the reset token
 * @returns {Promise<void>}
 */
const sendResetEmail = async (toEmail, toName, resetUrl) => {
    const htmlContent = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden;">
            <div style="background: #1a1a2e; padding: 32px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 800;">
                    Brief<span style="color: #E85D56;">AI</span>news
                </h1>
            </div>
            <div style="padding: 40px 32px;">
                <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 16px;">Hola ${toName},</h2>
                <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                    Recibimos una solicitud para restablecer la contraseña de tu cuenta. 
                    Haz clic en el botón de abajo para crear una nueva contraseña.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; background: #E85D56; color: #ffffff; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px;">
                        Restablecer contraseña
                    </a>
                </div>
                <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 0;">
                    Este enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este email.
                </p>
            </div>
            <div style="background: #f5f5f5; padding: 20px 32px; text-align: center;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © 2026 BriefAInews — Paraguay
                </p>
            </div>
        </div>
    `;

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: 'BriefAInews', email: process.env.BREVO_SENDER },
                to: [{ email: toEmail, name: toName }],
                subject: 'BriefAInews — Recuperar contraseña',
                htmlContent
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al conectar con Brevo');
        }
    } catch (error) {
        console.error(`[Brevo Error] ${error.message}`);
        const emailError = new Error('Error al enviar el email de recuperación');
        emailError.statusCode = 500;
        throw emailError;
    }
};

/**
 * Gets the current authenticated user's data by ID.
 * @param {string} userId - The MongoDB _id of the user
 * @returns {Promise<IUser>} User data without password
 */
const getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
    }
    return user;
};

module.exports = {
    registerUser,
    loginUser,
    generateResetToken,
    resetPassword,
    getUserById
};
