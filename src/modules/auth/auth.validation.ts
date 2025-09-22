import { z } from "zod";
import { LoginDTO, RegisterDTO } from "./auth.dto";
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