import { GENDER, SYS_ROLE, USER_AGENT } from "../enums"

export interface IUser {
    firstName?: string
    lastName?: string
    email: string
    password: string
    credentialsUpdatedAt: Date
    isVerified: boolean
    phoneNumber?: string
    dob?: Date
    otp?: string
    otpExpire?: Date
    fullName?: string
    age?: string
    role: SYS_ROLE
    gender: GENDER
    userAgent: USER_AGENT
}