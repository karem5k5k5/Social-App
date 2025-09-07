"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../utils/errors");
const user_repository_1 = require("../../DB/models/user/user.repository");
const factory_1 = require("./factory");
const mail_1 = require("../../utils/mail");
const hash_1 = require("../../utils/hash");
const token_1 = require("../../utils/token");
class AuthService {
    userRepository = new user_repository_1.UserRepository();
    authFactoryService = new factory_1.AuthFactoryService();
    constructor() { }
    register = async (req, res, next) => {
        // get data from req body
        const registerDTO = req.body;
        // check user existence
        const userExist = await this.userRepository.getOne({ email: registerDTO.email });
        if (userExist) {
            throw new errors_1.ConflictException("user already exist");
        }
        // prepare data 
        const user = this.authFactoryService.register(registerDTO);
        // send mail
        await (0, mail_1.sendMail)(user.email, "New OTP to verify account", `<p>your new otp to verify account is ${user.otp}</p>`);
        // save data to db
        await this.userRepository.create(user);
        // send reponse
        return res.status(201).json({ success: true, message: "user created successfully" });
    };
    verifyAccount = async (req, res, next) => {
        // get data from req body
        const sendOtpDTO = req.body;
        // check user otp & otp expire
        const user = await this.userRepository.getOne({ email: sendOtpDTO.email, otp: sendOtpDTO.otp, otpExpire: { $gt: new Date(Date.now()) } });
        if (!user) {
            throw new errors_1.NotAuthorizedException("invalid otp");
        }
        // update user
        user.isVerified = true;
        delete user.otp;
        delete user.otpExpire;
        // save user to db
        await this.userRepository.create(user);
        // send reponse
        return res.status(200).json({ success: true, message: "user verified successfully" });
    };
    login = async (req, res, next) => {
        // get data from req body
        const loginDTO = req.body;
        // check email
        const user = await this.userRepository.getOne({ email: loginDTO.email });
        if (!user) {
            throw new errors_1.NotAuthorizedException("invalid credentials");
        }
        // check passsword
        const isMatch = (0, hash_1.comparePassword)(loginDTO.password, user.password);
        if (!isMatch) {
            throw new errors_1.NotAuthorizedException("invalid credentials");
        }
        // check verification
        if (!user.isVerified) {
            throw new errors_1.NotAuthorizedException("please verify your account");
        }
        // generate token
        const token = (0, token_1.generateToken)(user.id, { expiresIn: "1h" });
        // send response
        return res.status(200).json({ success: true, message: "login successfully", token });
    };
}
exports.default = new AuthService();
