"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../utils/common/enums");
exports.updateUserSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(5).max(41).trim().optional(),
    email: zod_1.z.email().trim().toLowerCase().optional(),
    phoneNumber: zod_1.z.string().optional(),
    gender: zod_1.z.enum(enums_1.GENDER).optional()
});
