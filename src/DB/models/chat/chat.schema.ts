import { Schema } from "mongoose";
import { IChat } from "../../../utils/common/interfaces";

export const chatSchema = new Schema<IChat>({
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }]
}, { timestamps: true })