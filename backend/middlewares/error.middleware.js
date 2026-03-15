/**
 * Global Error Handler Middleware
 * Intercepts errors occurring in routes and prevents stack trace leakage in production.
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.name}: ${err.message}`);

    const statusCode = err.statusCode || 500;
    
    // In production, we don't return the stack trace
    const responseBody = {
        success: false,
        error: err.message || 'Internal Server Error'
    };

    if (process.env.NODE_ENV !== 'production') {
        responseBody.stack = err.stack;
    }

    res.status(statusCode).json(responseBody);
};

module.exports = {
    errorHandler
};
