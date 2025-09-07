"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../../../utils/common/enums");
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
    dob: Date,
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
exports.userSchema.virtual("fullName").get(function () {
    return this.firstName + " " + this.lastName;
}).set(function (value) {
    const [fName, lName] = value.split(" ");
    this.firstName = fName;
    this.lastName = lName;
});
