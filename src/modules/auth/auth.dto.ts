import { GENDER } from "../../utils/common/enums"

// DTO - data to object
export interface RegisterDTO {
    email: string
    password: string
    phoneNumber?: string
    dob?: Date
    fullName: string
    gender: GENDER
}

export interface VerifyAccountDTO {
    email: string
    otp: string
}

export interface LoginDTO {
    email: string
    password: string
}

export interface ResendOtpDTO {
    email: string
}