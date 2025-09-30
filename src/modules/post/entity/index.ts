import { ObjectId } from "mongoose"
import { IAttachment, IReaction } from "../../../utils/common/interfaces"

export class Post {
    userId: ObjectId
    content: string
    attachments: IAttachment[]
    reactions: IReaction[]
}