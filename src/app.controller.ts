import { Request, Response, type Express } from "express";
import authRouter from "./modules/auth/auth.controller"
import postRouter from "./modules/post/post.controller"
import commentRouter from "./modules/comment/comment.controller"
import userRouter from "./modules/user/user.controller"
import chatRouter from "./modules/chat/chat.controller"
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
    app.use("/user", userRouter)
    // post
    app.use("/post", postRouter)
    // comment
    app.use("/comment", commentRouter)
    // chat
    app.use("/chat", chatRouter)
    // invalid
    app.use("/{*dummy}", (req: Request, res: Response) => {
        return res.status(404).json({ success: false, message: "invalid router" })
    })

    // middleware - global error handler
    app.use(globalErrorHandler)
}