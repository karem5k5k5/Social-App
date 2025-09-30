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
    content: {
        type: String
    },
    reactions: [reactionSchema],
}, { timestamps: true })