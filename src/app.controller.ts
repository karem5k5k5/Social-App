import { Request, Response, type Express } from "express";
import authRouter from "./modules/auth/auth.controller"
import postRouter from "./modules/post/post.controller"
import commentRouter from "./modules/comment/comment.controller"
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
    // post
    app.use("/post", postRouter)
    // comment
    app.use("/comment", commentRouter)
    // message
    // invalid
    app.use("/{*dummy}", (req: Request, res: Response) => {
        return res.status(404).json({ success: false, message: "invalid router" })
    })

    // middleware - global error handler
    app.use(globalErrorHandler)
}