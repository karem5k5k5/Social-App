"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.craetePostSchema = void 0;
const zod_1 = require("zod");
exports.craetePostSchema = zod_1.z.object({
    content: zod_1.z.string().min(2)
});
