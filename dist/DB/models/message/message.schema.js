"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSchema = void 0;
const mongoose_1 = require("mongoose");
const reaction_schema_1 = require("../common/reaction.schema");
exports.messageSchema = new mongoose_1.Schema({
    content: String,
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    reactions: [reaction_schema_1.reactionSchema]
}, { timestamps: true });
