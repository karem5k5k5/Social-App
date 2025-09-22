"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authProvider = void 0;
const user_repository_1 = require("../../DB/models/user/user.repository");
const errors_1 = require("../../utils/errors");
exports.authProvider = {
    async checkOTP(veriftAccountDTO) {
        // initiate user repository
        const userRepository = new user_repository_1.UserRepository();
        // check user existence
        const user = await userRepository.getOne({ email: veriftAccountDTO.email });
        if (!user) {
            throw new errors_1.NotAuthorizedException("invalid email");
        }
        // check otp
        if (veriftAccountDTO.otp != user.otp) {
            throw new errors_1.NotAuthorizedException("invalid otp");
        }
        // check otp expire
        user.otpExpire = user.otpExpire;
        if (user.otpExpire < new Date()) {
            throw new errors_1.NotAuthorizedException("expired otp");
        }
        return user;
    }
};
