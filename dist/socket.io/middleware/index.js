"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageValidation = exports.socketAuth = void 0;
const token_1 = require("../../utils/token");
const user_repository_1 = require("../../DB/models/user/user.repository");
const errors_1 = require("../../utils/errors");
const socketAuth = async (socket, next) => {
    try {
        // get token from socket 
        const { authorization } = socket.handshake.auth;
        // verify token and get payload
        const { id } = (0, token_1.verifyToken)(authorization);
        // check user existence
        const userRepository = new user_repository_1.UserRepository();
        const user = await userRepository.getById(id);
        if (!user) {
            throw new errors_1.NotFoundException("user not found");
        }
        // add user to socket data
        socket.data.user = user;
        // call next
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.socketAuth = socketAuth;
const messageValidation = (schema) => {
    return (socket, next) => {
        try {
            let data = socket.data;
            const { success, error } = schema.safeParse(data);
            if (!success) {
                let errMessages = error.issues.map((isssue) => ({
                    path: isssue.path[0],
                    message: isssue.message
                }));
                throw new errors_1.BadRequestException("validation error", errMessages);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.messageValidation = messageValidation;
