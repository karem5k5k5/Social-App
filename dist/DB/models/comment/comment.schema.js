"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const mongoose_1 = require("mongoose");
const reaction_schema_1 = require("../common/reaction.schema");
exports.commentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    parentIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment",
            required: true
        }
    ],
    directParentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment"
    },
    content: {
        type: String
    },
    reactions: [reaction_schema_1.reactionSchema],
    isFreezed: Boolean
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.commentSchema.virtual("replies", {
    ref: "Comment",
    localField: "_id",
    foreignField: "parentIds"
});
exports.commentSchema.pre("deleteOne", async function (next) {
    const { _id } = this.getFilter();
    await this.model.deleteMany({ parentIds: { $in: _id } });
});
