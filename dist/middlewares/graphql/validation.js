"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlValidation = void 0;
const errors_1 = require("../../utils/errors");
const graphqlValidation = (schema, args) => {
    // validation
    let data = args;
    const { success, error } = schema.safeParse(data);
    if (!success) {
        let errMessages = error.issues.map((isssue) => ({
            path: isssue.path[0],
            message: isssue.message
        }));
        throw new errors_1.BadRequestException("validation error", errMessages);
    }
};
exports.graphqlValidation = graphqlValidation;
