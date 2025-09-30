"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const token_1 = require("../utils/token");
const user_repository_1 = require("../DB/models/user/user.repository");
const errors_1 = require("../utils/errors");
const isAuthenticated = async (req, res, next) => {
    // get token from req headers
    const token = req.headers.authorization;
    // verify token and get user id
    const { id } = (0, token_1.verifyToken)(token);
    // check user existence
    const userRepository = new user_repository_1.UserRepository();
    const user = await userRepository.getById(id);
    if (!user) {
        throw new errors_1.NotFoundException("user not found");
    }
    // add user to req
    req.user = user;
    // call next
    next();
};
exports.isAuthenticated = isAuthenticated;
