import { UserRepository } from "../../DB/models/user/user.repository"
import { NotAuthorizedException } from "../../utils/errors"
import { VerifyAccountDTO } from "./auth.dto"

export const authProvider = {
    async checkOTP(veriftAccountDTO: VerifyAccountDTO) {
        // initiate user repository
        const userRepository = new UserRepository()
        // check user existence
        const user = await userRepository.getOne({ email: veriftAccountDTO.email })
        if (!user) {
            throw new NotAuthorizedException("invalid email")
        }
        // check otp
        if (veriftAccountDTO.otp != user.otp) {
            throw new NotAuthorizedException("invalid otp")
        }
        // check otp expire
        user.otpExpire = user.otpExpire as Date
        if (user.otpExpire < new Date()) {
            throw new NotAuthorizedException("expired otp")
        }

        return user
    }
}