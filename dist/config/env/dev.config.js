"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.devConfig = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
    NODEMAILER_PASS: process.env.NODEMAILER_PASS,
    JWT_SECRET: process.env.JWT_SECRET
};
