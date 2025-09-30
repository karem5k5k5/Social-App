import { Schema } from "mongoose";
import { IPost } from "../../../utils/common/interfaces";
import { reactionSchema } from "../common/reaction.schema";

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
    reactions: [reactionSchema]

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

postSchema.virtual("comments", {
    localField: "_id",
    foreignField: "postId",
    ref: "Comment"
})