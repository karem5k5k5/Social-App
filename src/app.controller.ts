import { type Express } from "express";
import authRouter from "./modules/auth/auth.controller"
import { connectDB } from "./DB/connection";
import { globalErrorHandler } from "./utils/global-error-handler";

export function bootstrap(app: Express, express: any) {
    // database connection
    connectDB()

    // middleware - parse data from req body
    app.use(express.json())

    // routes
    // auth
    app.use("/auth", authRouter)
    // user
    // post
    // comment
    // message
    // invalid
    app.use("/{*dummy}", (req, res, next) => {
        return res.status(404).json({ success: false, message: "invalid router" })
    })

    // middleware - global error handler
    app.use(globalErrorHandler)
}