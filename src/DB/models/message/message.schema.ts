import { Schema } from "mongoose";
import { IMessage } from "../../../utils/common/interfaces";
import { reactionSchema } from "../common/reaction.schema";

export const messageSchema = new Schema<IMessage>({
    content: String,
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reactions: [reactionSchema]
}, { timestamps: true })