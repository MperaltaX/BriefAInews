const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes that require authentication.
 * Verifies the JWT from the Authorization header and attaches the user ID to req.user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const protect = async (req, res, next) => {
    try {
        let token = null;

        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            const error = new Error('No autorizado — token no proporcionado');
            error.statusCode = 401;
            throw error;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            const authError = new Error('No autorizado — token inválido o expirado');
            authError.statusCode = 401;
            return next(authError);
        }
        next(error);
    }
};

module.exports = {
    protect
};
