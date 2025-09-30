"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
const post_repository_1 = require("../../DB/models/post/post.repository");
const errors_1 = require("../../utils/errors");
const factory_1 = require("./factory");
class CommentService {
    commentRepository = new comment_repository_1.CommnetRepository();
    postRepository = new post_repository_1.PostRepository();
    commentFactoryService = new factory_1.CommentFactoryService();
    create = async (req, res) => {
        // get data from req
        const { id, postId } = req.params;
        const createCommentDTO = req.body;
        // check post existence
        const post = await this.postRepository.getById(postId);
        if (!post) {
            throw new errors_1.NotFoundException("post not found");
        }
        // check (parent) comment existence
        let comment;
        if (id) {
            comment = await this.commentRepository.getById(id);
            if (!comment) {
                throw new errors_1.NotFoundException("comment not found");
            }
        }
        // prepare data - factory
        const newComment = this.commentFactoryService.createComment(createCommentDTO, req.user, post, comment);
        // save comment to db
        await this.commentRepository.create(newComment);
        // send response
        return res.status(201).json({ success: true, message: "comment created successfully" });
    };
}
exports.default = new CommentService();
