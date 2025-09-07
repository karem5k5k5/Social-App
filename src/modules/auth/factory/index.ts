import { SYS_ROLE, USER_AGENT } from "../../../utils/common/enums";
import { hashPassword } from "../../../utils/hash";
import { generateExpiryDate, generateOTP } from "../../../utils/otp";
import { RegisterDTO, SendOtpDTO } from "../auth.dto";
import { User } from "../entity";

// factory design pattern
export class AuthFactoryService {
    register(registerDTO: RegisterDTO) {
        const user = new User()
        user.fullName = registerDTO.fullName
        user.email = registerDTO.email
        user.password = hashPassword(registerDTO.password)
        user.dob = registerDTO.dob as Date
        user.phoneNumber = registerDTO.phoneNumber as string
        user.gender = registerDTO.gender
        user.role = SYS_ROLE.user
        user.userAgent = USER_AGENT.local
        user.credentialsUpdatedAt = new Date(Date.now())
        user.otp = generateOTP()
        user.otpExpire = generateExpiryDate(5 * 60 * 1000)
        user.isVerified = false

        return user
    }
}