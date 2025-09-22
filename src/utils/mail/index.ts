import nodemailer from "nodemailer"
import { devConfig } from "../../config/env/dev.config"
import { MailOptions } from "nodemailer/lib/sendmail-transport"
export const sendMail = async (mailOptions: MailOptions) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: devConfig.NODEMAILER_EMAIL,
            pass: devConfig.NODEMAILER_PASS
        }
    })

    await transporter.sendMail(mailOptions)
}