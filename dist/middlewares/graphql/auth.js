"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlAuthenticate = void 0;
const user_repository_1 = require("../../DB/models/user/user.repository");
const errors_1 = require("../../utils/errors");
const token_1 = require("../../utils/token");
const graphqlAuthenticate = async (context) => {
    // get token from graphql conntext
    const token = context.token;
    // verify token and get user id
    const { id } = (0, token_1.verifyToken)(token);
    // check user existence
    const userRepository = new user_repository_1.UserRepository();
    const user = await userRepository.getById(id);
    if (!user) {
        throw new errors_1.NotFoundException("user not found");
    }
    // check token validation
    if (token != user.token) {
        throw new errors_1.ForbiddenException("invalid token");
    }
    // add user to context
    context.user = user;
};
exports.graphqlAuthenticate = graphqlAuthenticate;
