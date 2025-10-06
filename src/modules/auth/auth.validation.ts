import { z } from "zod";
import { LoginDTO, RegisterDTO, ResendOtpDTO, ResetPasswordDTO, VerifyAccountDTO } from "./auth.dto";
import { GENDER } from "../../utils/common/enums";

export const registerSchema = z.object<RegisterDTO>({
    fullName: z.string().min(5).max(41).trim() as unknown as string,
    email: z.email().trim().toLowerCase() as unknown as string,
    password: z.string().min(6).trim() as unknown as string,
    phoneNumber: z.string().optional() as unknown as string,
    gender: z.enum(GENDER) as unknown as GENDER
})

export const loginSchema = z.object<LoginDTO>({
    email: z.email().trim().toLowerCase() as unknown as string,
    password: z.string().min(6).trim() as unknown as string,
})

export const verifyAccountSchema = z.object<VerifyAccountDTO>({
    email: z.email().trim().toLowerCase() as unknown as string,
    otp: z.string().trim().length(5) as unknown as string
})

export const resendOTPSchema = z.object<ResendOtpDTO>({
    email: z.email().trim().toLowerCase() as unknown as string
})

export const resetPasswordSchema = z.object<ResetPasswordDTO>({
    email: z.email().trim().toLowerCase() as unknown as string,
    newPassword: z.string().min(6).trim() as unknown as string,
    otp: z.string().trim().length(5) as unknown as string
})