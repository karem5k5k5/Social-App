import { config } from "dotenv"

config()

export const devConfig = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
    NODEMAILER_PASS: process.env.NODEMAILER_PASS,
    JWT_SECRET: process.env.JWT_SECRET
}