"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionSchema = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../../../utils/common/enums");
exports.reactionSchema = new mongoose_1.Schema({
    reaction: {
        type: Number,
        enum: enums_1.REACTION,
        set: (v) => Number(v),
        default: enums_1.REACTION.like
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });
