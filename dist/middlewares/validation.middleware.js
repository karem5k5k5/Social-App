"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
const errors_1 = require("../utils/errors");
const isValid = (schema) => {
    return (req, res, next) => {
        // validation
        let data = { ...req.body, ...req.params, ...req.query };
        const { success, error } = schema.safeParse(data);
        if (!success) {
            let errMessages = error.issues.map((isssue) => ({
                path: isssue.path[0],
                message: isssue.message
            }));
            throw new errors_1.BadRequestException("validation error", errMessages);
        }
        next();
    };
};
exports.isValid = isValid;
