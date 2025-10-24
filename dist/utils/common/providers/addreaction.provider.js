"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReactionProvider = void 0;
const errors_1 = require("../../errors");
const addReactionProvider = async (repo, id, userId, reaction) => {
    // check content existence
    const content = await repo.getById(id, {}, {
        populate: { path: "userId", select: "blockedUsers" }
    });
    if (!content) {
        throw new errors_1.NotFoundException("content not found");
    }
    // check content freeze
    if (content.isFreezed) {
        throw new errors_1.ForbiddenException("content is freezed");
    }
    // check user block
    const contentOwner = content.userId;
    if (contentOwner.blockedUsers.includes(userId)) {
        throw new errors_1.UnAuthorizedException("user is blocked");
    }
    // update content
    const userReactedIndex = content.reactions.findIndex((reaction) => {
        return reaction.userId.toString() == userId.toString();
    });
    if (userReactedIndex == -1) {
        await repo.updateOne({ _id: id }, { $push: { reactions: { reaction, userId } } });
    }
    else if ([undefined, null, ""].includes(reaction)) {
        await repo.updateOne({ _id: id }, { $pull: { reactions: content.reactions[userReactedIndex] } });
    }
    else {
        await repo.updateOne({ _id: id, "reactions.userId": userId }, { "reactions.$.reaction": reaction });
    }
};
exports.addReactionProvider = addReactionProvider;
