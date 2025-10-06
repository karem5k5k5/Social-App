"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentFactoryService = void 0;
const entity_1 = require("../entity");
class CommentFactoryService {
    createComment(createCommentDTO, user, post, comment) {
        const newComment = new entity_1.Comment();
        newComment.content = createCommentDTO.content;
        newComment.userId = user._id;
        newComment.postId = post._id;
        newComment.parentIds = comment ? [...comment.parentIds, comment._id] : [];
        newComment.directParentId = comment ? comment._id : null;
        newComment.reactions = [];
        return newComment;
    }
}
exports.CommentFactoryService = CommentFactoryService;
