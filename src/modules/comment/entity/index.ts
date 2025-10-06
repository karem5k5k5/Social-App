import { ObjectId } from "mongoose"
import { IAttachment, IReaction } from "../../../utils/common/interfaces"

export class Comment {
    userId: ObjectId
    postId: ObjectId
    parentIds: ObjectId[]
    directParentId:ObjectId | null
    content: string
    attachment?: IAttachment
    reactions: IReaction[]
    mentions?: ObjectId[]
}