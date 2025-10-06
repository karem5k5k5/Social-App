import { ObjectId } from "mongoose"
import { CommnetRepository } from "../../../DB/models/comment/comment.repository"
import { PostRepository } from "../../../DB/models/post/post.repository"
import { NotFoundException } from "../../errors"

export const addReactionProvider = async (repo: PostRepository | CommnetRepository, id: string, userId: ObjectId, reaction: string) => {
    // check post existence
    const content = await repo.getById(id)
    if (!content) {
        throw new NotFoundException("content not found")
    }
    // update content
    const userReactedIndex = content.reactions.findIndex((reaction) => {
        return reaction.userId.toString() == userId.toString()
    })
    if (userReactedIndex == -1) {
        await repo.updateOne({ _id: id }, { $push: { reactions: { reaction, userId } } })
    } else if ([undefined, null, ""].includes(reaction)) {
        await repo.updateOne({ _id: id }, { $pull: { reactions: content.reactions[userReactedIndex] } })
    } else {
        await repo.updateOne({ _id: id, "reactions.userId": userId }, { "reactions.$.reaction": reaction })
    }
}