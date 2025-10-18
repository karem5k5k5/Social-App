import { Router } from "express";
import authService from "./auth.service";
import { isValid } from "../../middlewares/validation.middleware";
import { loginSchema, registerSchema, resendOTPSchema, resetPasswordSchema, verifyAccountSchema } from "./auth.validation";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = Router()

router.post("/register", isValid(registerSchema), authService.register)
router.post("/verify-account", isValid(verifyAccountSchema), authService.verifyAccount)
router.post("/login", isValid(loginSchema), authService.login)
router.post("/resend-otp", isValid(resendOTPSchema), authService.resendOTP)
router.patch("/reset-password", isValid(resetPasswordSchema), authService.resetPassword)
router.post("/logout", isAuthenticated, authService.logout)

export default router