import { UserRepository } from "../../DB/models/user/user.repository"
import { ForbiddenException } from "../../utils/errors"
import { VerifyAccountDTO } from "./auth.dto"

export const authProvider = {
    async checkOTP(veriftAccountDTO: VerifyAccountDTO) {
        // initiate user repository
        const userRepository = new UserRepository()
        // check user existence
        const user = await userRepository.getOne({ email: veriftAccountDTO.email })
        if (!user) {
            throw new ForbiddenException("invalid email")
        }
        // check otp
        if (veriftAccountDTO.otp != user.otp) {
            throw new ForbiddenException("invalid otp")
        }
        // check otp expire
        user.otpExpire = user.otpExpire as Date
        if (user.otpExpire < new Date()) {
            throw new ForbiddenException("expired otp")
        }

        return user
    }
}