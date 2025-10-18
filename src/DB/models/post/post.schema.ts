import { Schema } from "mongoose";
import { IPost } from "../../../utils/common/interfaces";
import { reactionSchema } from "../common/reaction.schema";
import { Comment } from "../comment/comment.model";

export const postSchema = new Schema<IPost>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    reactions: [reactionSchema],
    isFreezed: Boolean

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

postSchema.virtual("comments", {
    localField: "_id",
    foreignField: "postId",
    ref: "Comment"
})

postSchema.pre("deleteOne", async function (next) {
    const { _id } = this.getFilter()
    await Comment.deleteMany({ postId: _id })
})