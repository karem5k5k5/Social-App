import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils/common/enums"

export class User {
    firstName!: string
    lastName!: string
    email!: string
    password!: string
    credentialsUpdatedAt!: Date
    isVerified!: boolean
    phoneNumber!: string
    otp!: string
    otpExpire!: Date
    fullName!: string
    age!: string
    role!: SYS_ROLE
    gender!: GENDER
    userAgent!: USER_AGENT
}