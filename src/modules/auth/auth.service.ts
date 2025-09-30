import type { Request, Response } from "express";
import { LoginDTO, RegisterDTO, ResendOtpDTO, VerifyAccountDTO } from "./auth.dto";
import { ConflictException, ForbiddenException, UnAuthorizedException } from "../../utils/errors";
import { UserRepository } from "../../DB/models/user/user.repository";
import { AuthFactoryService } from "./factory";
import { sendMail } from "../../utils/mail";
import { comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/token";
import { generateExpiryDate, generateOTP } from "../../utils/otp";
import { devConfig } from "../../config/env/dev.config";
import { authProvider } from "./auth.provider";

class AuthService {
    private readonly userRepository = new UserRepository()
    private readonly authFactoryService = new AuthFactoryService()
    constructor() { }

    register = async (req: Request, res: Response) => {
        // get data from req body
        const registerDTO: RegisterDTO = req.body
        // check user existence
        const userExist = await this.userRepository.getOne({ email: registerDTO.email })
        if (userExist) {
            throw new ConflictException("user already exist")
        }
        // prepare data 
        const user = await this.authFactoryService.register(registerDTO)
        // save data to db
        await this.userRepository.create(user)
        // send reponse
        return res.status(201).json({ success: true, message: "user created successfully" })
    }

    verifyAccount = async (req: Request, res: Response) => {
        // get data from req body
        const veriftAccountDTO: VerifyAccountDTO = req.body
        // check otp
        const user = await authProvider.checkOTP(veriftAccountDTO)
        // update user
        await this.userRepository.updateOne({ email: user.email }, { isVerified: true, $unset: { otp: "", otpExpire: "" } })
        // send reponse
        return res.status(200).json({ success: true, message: "user verified successfully" })
    }

    login = async (req: Request, res: Response) => {
        // get data from req body
        const loginDTO: LoginDTO = req.body
        // check email
        const user = await this.userRepository.getOne({ email: loginDTO.email })
        if (!user) {
            throw new ForbiddenException("invalid credentials")
        }
        // check passsword
        const isMatch = comparePassword(loginDTO.password, user.password)
        if (!isMatch) {
            throw new ForbiddenException("invalid credentials")
        }
        // check verification
        if (!user.isVerified) {
            throw new ForbiddenException("please verify your account")
        }
        // generate token
        const token = generateToken(user.id, { expiresIn: "1h" })
        // send response
        return res.status(200).json({ success: true, message: "login successfully", token })
    }

    resendOTP = async (req: Request, res: Response) => {
        // get data from req body
        const resendOtpDTO: ResendOtpDTO = req.body
        // generate new otp & otp expiry date
        const otp = generateOTP()
        const otpExpire = generateExpiryDate(5 * 60 * 1000)
        // check for email validation
        const user = await this.userRepository.getOneAndUpdate({ email: resendOtpDTO.email }, { otp, otpExpire })
        if (!user) {
            throw new UnAuthorizedException("invalid email")
        }
        // send otp
        await sendMail({
            from: `Social App <${devConfig.NODEMAILER_EMAIL}>`,
            to: user.email,
            subject: "New OTP",
            html: `<p>your new otp is <b>${user.otp}</b></p>`
        })
        // send response
        return res.status(200).json({ success: true, message: "new otp sent successfully" })
    }
}

export default new AuthService()