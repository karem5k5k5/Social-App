"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const auth_controller_1 = __importDefault(require("./modules/auth/auth.controller"));
const post_controller_1 = __importDefault(require("./modules/post/post.controller"));
const comment_controller_1 = __importDefault(require("./modules/comment/comment.controller"));
const user_controller_1 = __importDefault(require("./modules/user/user.controller"));
const chat_controller_1 = __importDefault(require("./modules/chat/chat.controller"));
const connection_1 = require("./DB/connection");
const global_error_handler_1 = require("./utils/global-error-handler");
const express_1 = require("graphql-http/lib/use/express");
const app_schema_1 = require("./app.schema");
function bootstrap(app, express) {
    // database connection
    (0, connection_1.connectDB)();
    // middleware - parse data from req body
    app.use(express.json());
    // routes
    // auth
    app.use("/auth", auth_controller_1.default);
    // user
    app.use("/user", user_controller_1.default);
    // post
    app.use("/post", post_controller_1.default);
    // comment
    app.use("/comment", comment_controller_1.default);
    // chat
    app.use("/chat", chat_controller_1.default);
    // graphql
    app.all("/graphql", (0, express_1.createHandler)({
        schema: app_schema_1.appSchema,
        formatError: (error) => {
            return {
                success: false,
                message: error.message,
                path: error.path,
                details: error.originalError
            };
        },
        context: (req) => {
            const token = req.headers["authorization"];
            return { token };
        }
    }));
    // invalid
    app.use("/{*dummy}", (req, res) => {
        return res.status(404).json({ success: false, message: "invalid router" });
    });
    // middleware - global error handler
    app.use(global_error_handler_1.globalErrorHandler);
}
