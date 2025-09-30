import { Router } from "express";
import authService from "./auth.service";
import { isValid } from "../../middlewares/validation.middleware";
import { loginSchema, registerSchema, resendOTPSchema, verifyAccountSchema } from "./auth.validation";

const router = Router()

router.post("/register", isValid(registerSchema), authService.register)
router.post("/verify-account", isValid(verifyAccountSchema), authService.verifyAccount)
router.post("/login", isValid(loginSchema), authService.login)
router.post("/resend-otp", isValid(resendOTPSchema), authService.resendOTP)

export default router