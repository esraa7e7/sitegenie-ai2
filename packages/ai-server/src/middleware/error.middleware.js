import { AppError } from '../core/errors.js';
export const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    // Log unexpected errors
    console.error('🔥 UNEXPECTED ERROR:', err);
    return res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong'
            : err.message,
    });
};
