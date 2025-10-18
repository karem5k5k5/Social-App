import { ObjectId } from "mongoose"
import { CommnetRepository } from "../../../DB/models/comment/comment.repository"
import { PostRepository } from "../../../DB/models/post/post.repository"
import { ForbiddenException, NotFoundException, UnAuthorizedException } from "../../errors"
import { IUser } from "../interfaces"

export const addReactionProvider = async (repo: PostRepository | CommnetRepository, id: string, userId: ObjectId, reaction: string) => {
    // check content existence
    const content = await repo.getById(id, {}, {
        populate: { path: "userId", select: "blockedUsers" }
    })
    if (!content) {
        throw new NotFoundException("content not found")
    }
    // check content freeze
    if (content.isFreezed) {
        throw new ForbiddenException("content is freezed")
    }
    // check user block
    const contentOwner = content.userId as unknown as IUser
    if (contentOwner.blockedUsers.includes(userId)) {
        throw new UnAuthorizedException("user is blocked")
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