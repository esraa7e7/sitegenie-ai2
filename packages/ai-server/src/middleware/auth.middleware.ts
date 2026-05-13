import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../auth/jwt.js';
import { UnauthorizedError } from '../core/errors.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token as string;
    }

    if (!token) {
      throw new UnauthorizedError('Missing or invalid authentication token');
    }

    const payload = await verifyToken(token);

    if (!payload) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    (req as any).user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    if (!roles.includes(userRole)) {
      return next(new UnauthorizedError('You do not have permission to perform this action'));
    }
    next();
  };
};
