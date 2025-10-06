"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post("/register", (0, validation_middleware_1.isValid)(auth_validation_1.registerSchema), auth_service_1.default.register);
router.post("/verify-account", (0, validation_middleware_1.isValid)(auth_validation_1.verifyAccountSchema), auth_service_1.default.verifyAccount);
router.post("/login", (0, validation_middleware_1.isValid)(auth_validation_1.loginSchema), auth_service_1.default.login);
router.post("/resend-otp", (0, validation_middleware_1.isValid)(auth_validation_1.resendOTPSchema), auth_service_1.default.resendOTP);
router.patch("/reset-password", (0, validation_middleware_1.isValid)(auth_validation_1.resetPasswordSchema), auth_service_1.default.resetPassword);
exports.default = router;
