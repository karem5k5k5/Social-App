import { Schema } from "mongoose";
import { IComment } from "../../../utils/common/interfaces";
import { reactionSchema } from "../common/reaction.schema";

export const commentSchema = new Schema<IComment>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    parentIds: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            required: true
        }
    ],
    directParentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    content: {
        type: String
    },
    reactions: [reactionSchema],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

commentSchema.virtual("replies", {
    ref: "Comment",
    localField: "_id",
    foreignField: "parentIds"
})

commentSchema.pre("deleteOne", async function (next) {
    const { _id } = this.getFilter()
    await this.model.deleteMany({ parentIds: { $in: _id } })
})