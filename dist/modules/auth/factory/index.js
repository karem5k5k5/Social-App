"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFactoryService = void 0;
const enums_1 = require("../../../utils/common/enums");
const hash_1 = require("../../../utils/hash");
const otp_1 = require("../../../utils/otp");
const entity_1 = require("../entity");
// factory design pattern
class AuthFactoryService {
    register(registerDTO) {
        const user = new entity_1.User();
        user.fullName = registerDTO.fullName;
        user.email = registerDTO.email;
        user.password = (0, hash_1.hashPassword)(registerDTO.password);
        user.dob = registerDTO.dob;
        user.phoneNumber = registerDTO.phoneNumber;
        user.gender = registerDTO.gender;
        user.role = enums_1.SYS_ROLE.user;
        user.userAgent = enums_1.USER_AGENT.local;
        user.credentialsUpdatedAt = new Date(Date.now());
        user.otp = (0, otp_1.generateOTP)();
        user.otpExpire = (0, otp_1.generateExpiryDate)(5 * 60 * 1000);
        user.isVerified = false;
        return user;
    }
}
exports.AuthFactoryService = AuthFactoryService;
