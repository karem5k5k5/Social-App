import { z } from "zod";
import { GENDER } from "../../utils/common/enums";
import { UpdateUserDTO } from "./user.dto";

export const updateUserSchema = z.object<UpdateUserDTO>({
    fullName: z.string().min(5).max(41).trim().optional() as unknown as string,
    email: z.email().trim().toLowerCase().optional() as unknown as string,
    phoneNumber: z.string().optional() as unknown as string,
    gender: z.enum(GENDER).optional() as unknown as GENDER
})