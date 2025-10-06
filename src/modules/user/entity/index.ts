import { SYS_ROLE, GENDER, USER_AGENT } from "../../../utils/common/enums"

class User {
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

export default User
