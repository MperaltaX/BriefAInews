const authService = require('../services/auth.service');

/**
 * Controller: Register a new user
 * POST /api/auth/register
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            const error = new Error('Nombre, email y contraseña son obligatorios');
            error.statusCode = 400;
            throw error;
        }

        const result = await authService.registerUser({ name, email, password });

        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller: Login an existing user
 * POST /api/auth/login
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Email y contraseña son obligatorios');
            error.statusCode = 400;
            throw error;
        }

        const result = await authService.loginUser({ email, password });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller: Request password reset email
 * POST /api/auth/forgot-password
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            const error = new Error('El email es obligatorio');
            error.statusCode = 400;
            throw error;
        }

        await authService.generateResetToken(email);

        res.status(200).json({
            success: true,
            message: 'Email de recuperación enviado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller: Reset password with token
 * POST /api/auth/reset-password
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            const error = new Error('Token y nueva contraseña son obligatorios');
            error.statusCode = 400;
            throw error;
        }

        await authService.resetPassword({ token, newPassword });

        res.status(200).json({
            success: true,
            message: 'Contraseña restablecida correctamente'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller: Get current authenticated user
 * GET /api/auth/me
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getMe = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    getMe
};
