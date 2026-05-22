export class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        Object.defineProperty(this, "statusCode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isOperational", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 411);
    }
}
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}
export class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}
