"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user.service"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.get("/:id", user_service_1.default.getUserById);
router.patch("/update", (0, validation_middleware_1.isValid)(user_validation_1.updateUserSchema), auth_middleware_1.isAuthenticated, user_service_1.default.updateUser);
router.post("/send-friend-request/:friendId", auth_middleware_1.isAuthenticated, user_service_1.default.sendFriendRequest);
router.patch("/accept-request/:friendId", auth_middleware_1.isAuthenticated, user_service_1.default.acceptRequest);
router.delete("/reject-request/:friendId", auth_middleware_1.isAuthenticated, user_service_1.default.rejectRequest);
router.patch("/block/:id", auth_middleware_1.isAuthenticated, user_service_1.default.blockUser);
router.delete("/unfriend/:id", auth_middleware_1.isAuthenticated, user_service_1.default.unfriend);
exports.default = router;
