"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = exports.UnAuthorizedException = exports.ForbiddenException = exports.NotFoundException = exports.ConflictException = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    errorDetails;
    constructor(message, statusCode, errorDetails) {
        super(message);
        this.statusCode = statusCode;
        this.errorDetails = errorDetails;
    }
}
exports.AppError = AppError;
class ConflictException extends AppError {
    constructor(message, errorDetails) {
        super(message, 409, errorDetails);
    }
}
exports.ConflictException = ConflictException;
class NotFoundException extends AppError {
    constructor(message, errorDetails) {
        super(message, 404, errorDetails);
    }
}
exports.NotFoundException = NotFoundException;
class ForbiddenException extends AppError {
    constructor(message, errorDetails) {
        super(message, 403, errorDetails);
    }
}
exports.ForbiddenException = ForbiddenException;
class UnAuthorizedException extends AppError {
    constructor(message, errorDetails) {
        super(message, 401, errorDetails);
    }
}
exports.UnAuthorizedException = UnAuthorizedException;
class BadRequestException extends AppError {
    constructor(message, errorDetails) {
        super(message, 400, errorDetails);
    }
}
exports.BadRequestException = BadRequestException;
