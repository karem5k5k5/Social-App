"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dev_config_1 = require("../../config/env/dev.config");
const sendMail = async (mailOptions) => {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: dev_config_1.devConfig.NODEMAILER_EMAIL,
            pass: dev_config_1.devConfig.NODEMAILER_PASS
        }
    });
    await transporter.sendMail(mailOptions);
};
exports.sendMail = sendMail;
