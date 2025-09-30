import { Schema } from "mongoose";
import { IReaction } from "../../../utils/common/interfaces";
import { REACTION } from "../../../utils/common/enums";

export const reactionSchema = new Schema<IReaction>({
    reaction: {
        type: Number,
        enum: REACTION,
        set: (v) => Number(v),
        default: REACTION.like
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })