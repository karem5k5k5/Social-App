import { Schema } from "mongoose";
import { IUser } from "../../../utils/common/interfaces";
import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils/common/enums";
import { sendMail } from "../../../utils/mail";
import { devConfig } from "../../../config/env/dev.config";

export const userSchema = new Schema<IUser>({
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
            if (this.userAgent == USER_AGENT.google) {
                return false
            }
            return true
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
        type: Number,
        enum: SYS_ROLE,
        default: SYS_ROLE.user
    },
    gender: {
        type: Number,
        enum: GENDER
    },
    userAgent: {
        type: Number,
        enum: USER_AGENT,
        default: USER_AGENT.local
    },

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

// virtual field
userSchema.virtual("fullName").get(function () {
    return this.firstName + " " + this.lastName
}).set(function (value: string) {
    const [fName, lName] = value.split(" ")
    this.firstName = fName as string
    this.lastName = lName as string
})

// hooks - mongoose middlewares
userSchema.pre("save", async function () {
    if (this.userAgent != USER_AGENT.google && this.isNew == true) {
        // send mail
        await sendMail({
            from: `Social App <${devConfig.NODEMAILER_EMAIL}>`,
            to: this.email,
            subject: "Verify Account",
            html: `<p>your otp to verify account is <b>${this.otp}</b></p>`
        })
    }
})