"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
const post_repository_1 = require("../../DB/models/post/post.repository");
const errors_1 = require("../../utils/errors");
const factory_1 = require("./factory");
const addreaction_provider_1 = require("../../utils/common/providers/addreaction.provider");
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
    getCommentById = async (req, res) => {
        // get data from req
        const { id } = req.params;
        // check comment existence
        const comment = await this.commentRepository.getById(id, {}, {
            populate: [
                { path: "replies", match: { directParentId: id } }
            ]
        });
        if (!comment) {
            throw new errors_1.NotFoundException("comment not found");
        }
        // send response
        return res.status(200).json({ success: true, comment });
    };
    deleteComment = async (req, res) => {
        // get data from req
        const { id } = req.params;
        // check comment existence
        const comment = await this.commentRepository.getById(id, {}, {
            populate: [
                { path: "postId", select: "userId" }
            ]
        });
        if (!comment) {
            throw new errors_1.NotFoundException("comment not found");
        }
        // check user authority
        if (comment.userId.toString() !== req.user._id.toString() || comment.postId.userId.toString() !== req.user._id.toString()) {
            throw new errors_1.UnAuthorizedException("you are not authorized to delte this post");
        }
        // delete comment
        await this.commentRepository.deleteOne({ _id: id });
        // send response
        return res.status(200).json({ success: true, message: "comment deleted successfully" });
    };
    addReaction = async (req, res) => {
        // get data from req
        const { id } = req.params;
        const userId = req.user._id;
        const { reaction } = req.body;
        // add reaction - provider
        await (0, addreaction_provider_1.addReactionProvider)(this.commentRepository, id, userId, reaction);
        // send response
        return res.sendStatus(204);
    };
}
exports.default = new CommentService();
