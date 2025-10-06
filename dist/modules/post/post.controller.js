"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const post_service_1 = __importDefault(require("./post.service"));
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const post_validation_1 = require("./post.validation");
const comment_controller_1 = __importDefault(require("../comment/comment.controller"));
const router = (0, express_1.Router)();
// comment router
router.use("/:postId/comment", comment_controller_1.default);
// post routes
router.post("/", (0, validation_middleware_1.isValid)(post_validation_1.craetePostSchema), auth_middleware_1.isAuthenticated, post_service_1.default.create);
router.patch("/:id", auth_middleware_1.isAuthenticated, post_service_1.default.addReaction);
router.delete("/:id", auth_middleware_1.isAuthenticated, post_service_1.default.deletePost);
// public
router.get("/:id", post_service_1.default.getPostById);
exports.default = router;
