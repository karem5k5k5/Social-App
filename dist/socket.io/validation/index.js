"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.sendMessageSchema = zod_1.default.object({
    sender: zod_1.default.string().length(24).regex(/^[0-9a-fA-F]{24}$/),
    message: zod_1.default.string().min(2).max(1000)
});
