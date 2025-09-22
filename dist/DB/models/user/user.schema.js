"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../../../utils/common/enums");
const mail_1 = require("../../../utils/mail");
const dev_config_1 = require("../../../config/env/dev.config");
exports.userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        minLength: 2,
        maxLength: 20,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 20,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function () {
            if (this.userAgent == enums_1.USER_AGENT.google) {
                return false;
            }
            return true;
        }
    },
    credentialsUpdatedAt: Date,
    phoneNumber: String,
    otp: String,
    otpExpire: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: enums_1.SYS_ROLE,
        default: enums_1.SYS_ROLE.user
    },
    gender: {
        type: String,
        enum: enums_1.GENDER
    },
    userAgent: {
        type: String,
        enum: enums_1.USER_AGENT,
        default: enums_1.USER_AGENT.local
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
// virtual field
exports.userSchema.virtual("fullName").get(function () {
    return this.firstName + " " + this.lastName;
}).set(function (value) {
    const [fName, lName] = value.split(" ");
    this.firstName = fName;
    this.lastName = lName;
});
// hooks - mongoose middlewares
exports.userSchema.pre("save", async function () {
    if (this.userAgent != enums_1.USER_AGENT.google && this.isNew == true) {
        // send mail
        await (0, mail_1.sendMail)({
            from: `Social App <${dev_config_1.devConfig.NODEMAILER_EMAIL}>`,
            to: this.email,
            subject: "Verify Account",
            html: `<p>your otp to verify account is <b>${this.otp}</b></p>`
        });
    }
});
