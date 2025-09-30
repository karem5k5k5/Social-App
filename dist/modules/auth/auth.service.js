"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../utils/errors");
const user_repository_1 = require("../../DB/models/user/user.repository");
const factory_1 = require("./factory");
const mail_1 = require("../../utils/mail");
const hash_1 = require("../../utils/hash");
const token_1 = require("../../utils/token");
const otp_1 = require("../../utils/otp");
const dev_config_1 = require("../../config/env/dev.config");
const auth_provider_1 = require("./auth.provider");
class AuthService {
    userRepository = new user_repository_1.UserRepository();
    authFactoryService = new factory_1.AuthFactoryService();
    constructor() { }
    register = async (req, res) => {
        // get data from req body
        const registerDTO = req.body;
        // check user existence
        const userExist = await this.userRepository.getOne({ email: registerDTO.email });
        if (userExist) {
            throw new errors_1.ConflictException("user already exist");
        }
        // prepare data 
        const user = await this.authFactoryService.register(registerDTO);
        // save data to db
        await this.userRepository.create(user);
        // send reponse
        return res.status(201).json({ success: true, message: "user created successfully" });
    };
    verifyAccount = async (req, res) => {
        // get data from req body
        const veriftAccountDTO = req.body;
        // check otp
        const user = await auth_provider_1.authProvider.checkOTP(veriftAccountDTO);
        // update user
        await this.userRepository.updateOne({ email: user.email }, { isVerified: true, $unset: { otp: "", otpExpire: "" } });
        // send reponse
        return res.status(200).json({ success: true, message: "user verified successfully" });
    };
    login = async (req, res) => {
        // get data from req body
        const loginDTO = req.body;
        // check email
        const user = await this.userRepository.getOne({ email: loginDTO.email });
        if (!user) {
            throw new errors_1.ForbiddenException("invalid credentials");
        }
        // check passsword
        const isMatch = (0, hash_1.comparePassword)(loginDTO.password, user.password);
        if (!isMatch) {
            throw new errors_1.ForbiddenException("invalid credentials");
        }
        // check verification
        if (!user.isVerified) {
            throw new errors_1.ForbiddenException("please verify your account");
        }
        // generate token
        const token = (0, token_1.generateToken)(user.id, { expiresIn: "1h" });
        // send response
        return res.status(200).json({ success: true, message: "login successfully", token });
    };
    resendOTP = async (req, res) => {
        // get data from req body
        const resendOtpDTO = req.body;
        // generate new otp & otp expiry date
        const otp = (0, otp_1.generateOTP)();
        const otpExpire = (0, otp_1.generateExpiryDate)(5 * 60 * 1000);
        // check for email validation
        const user = await this.userRepository.getOneAndUpdate({ email: resendOtpDTO.email }, { otp, otpExpire });
        if (!user) {
            throw new errors_1.UnAuthorizedException("invalid email");
        }
        // send otp
        await (0, mail_1.sendMail)({
            from: `Social App <${dev_config_1.devConfig.NODEMAILER_EMAIL}>`,
            to: user.email,
            subject: "New OTP",
            html: `<p>your new otp is <b>${user.otp}</b></p>`
        });
        // send response
        return res.status(200).json({ success: true, message: "new otp sent successfully" });
    };
}
exports.default = new AuthService();
