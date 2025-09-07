"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
};
exports.globalErrorHandler = globalErrorHandler;
