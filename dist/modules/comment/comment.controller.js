"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_service_1 = __importDefault(require("./comment.service"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("{/:id}", auth_middleware_1.isAuthenticated, comment_service_1.default.create);
router.get("/:id", comment_service_1.default.getCommentById);
router.delete("/:id", auth_middleware_1.isAuthenticated, comment_service_1.default.deleteComment);
router.patch("/:id", auth_middleware_1.isAuthenticated, comment_service_1.default.addReaction);
exports.default = router;
