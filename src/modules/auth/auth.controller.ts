import { Router } from "express";
import authService from "./auth.service";
import { isValid } from "../../middlewares/validation.middleware";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router()

router.post("/register", isValid(registerSchema), authService.register)
router.post("/verify-account", authService.verifyAccount)
router.post("/login", isValid(loginSchema), authService.login)
router.post("/resend-otp", authService.resendOTP)

export default router