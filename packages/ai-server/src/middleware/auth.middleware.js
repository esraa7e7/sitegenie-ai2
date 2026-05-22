import { verifyToken } from '../auth/jwt.js';
import { UnauthorizedError } from '../core/errors.js';
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token = '';
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        else if (req.query.token) {
            token = req.query.token;
        }
        if (!token) {
            throw new UnauthorizedError('Missing or invalid authentication token');
        }
        const payload = await verifyToken(token);
        if (!payload) {
            throw new UnauthorizedError('Invalid or expired token');
        }
        req.user = payload;
        next();
    }
    catch (error) {
        next(error);
    }
};
export const authorize = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!roles.includes(userRole)) {
            return next(new UnauthorizedError('You do not have permission to perform this action'));
        }
        next();
    };
};
