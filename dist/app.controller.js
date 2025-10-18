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
const connection_1 = require("./DB/connection");
const global_error_handler_1 = require("./utils/global-error-handler");
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
    // message
    // invalid
    app.use("/{*dummy}", (req, res) => {
        return res.status(404).json({ success: false, message: "invalid router" });
    });
    // middleware - global error handler
    app.use(global_error_handler_1.globalErrorHandler);
}
