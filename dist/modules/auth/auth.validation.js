"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOTPSchema = exports.verifyAccountSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../utils/common/enums");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(5).max(41).trim(),
    email: zod_1.z.email().trim().toLowerCase(),
    password: zod_1.z.string().min(6).trim(),
    phoneNumber: zod_1.z.string().optional(),
    gender: zod_1.z.enum(enums_1.GENDER)
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase(),
    password: zod_1.z.string().min(6).trim(),
});
exports.verifyAccountSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase(),
    otp: zod_1.z.string().trim().length(5)
});
exports.resendOTPSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase()
});
