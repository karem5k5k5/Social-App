import type { NextFunction, Request, Response } from "express";
import { LoginDTO, RegisterDTO, SendOtpDTO } from "./auth.dto";
import { ConflictException, NotAuthorizedException } from "../../utils/errors";
import { UserRepository } from "../../DB/models/user/user.repository";
import { AuthFactoryService } from "./factory";
import { sendMail } from "../../utils/mail";
import { comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/token";

class AuthService {
    private userRepository = new UserRepository()
    private authFactoryService = new AuthFactoryService()
    constructor() { }

    register = async (req: Request, res: Response, next: NextFunction) => {
        // get data from req body
        const registerDTO: RegisterDTO = req.body
        // check user existence
        const userExist = await this.userRepository.getOne({ email: registerDTO.email })
        if (userExist) {
            throw new ConflictException("user already exist")
        }
        // prepare data 
        const user = this.authFactoryService.register(registerDTO)
        // send mail
        await sendMail(
            user.email,
            "New OTP to verify account",
            `<p>your new otp to verify account is ${user.otp}</p>`
        )
        // save data to db
        await this.userRepository.create(user)
        // send reponse
        return res.status(201).json({ success: true, message: "user created successfully" })
    }

    verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
        // get data from req body
        const sendOtpDTO: SendOtpDTO = req.body
        // check user otp & otp expire
        const user = await this.userRepository.getOne({ email: sendOtpDTO.email, otp: sendOtpDTO.otp, otpExpire: { $gt: new Date(Date.now()) } })
        if (!user) {
            throw new NotAuthorizedException("invalid otp")
        }
        // update user
        user.isVerified = true
        delete user.otp
        delete user.otpExpire
        // save user to db
        await this.userRepository.create(user)
        // send reponse
        return res.status(200).json({ success: true, message: "user verified successfully" })
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        // get data from req body
        const loginDTO: LoginDTO = req.body
        // check email
        const user = await this.userRepository.getOne({ email: loginDTO.email })
        if (!user) {
            throw new NotAuthorizedException("invalid credentials")
        }
        // check passsword
        const isMatch = comparePassword(loginDTO.password, user.password)
        if (!isMatch) {
            throw new NotAuthorizedException("invalid credentials")
        }
        // check verification
        if (!user.isVerified) {
            throw new NotAuthorizedException("please verify your account")
        }
        // generate token
        const token = generateToken(user.id, { expiresIn: "1h" })
        // send response
        return res.status(200).json({ success: true, message: "login successfully", token })
    }
}

export default new AuthService()