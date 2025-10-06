"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const factory_1 = require("./factory");
const post_repository_1 = require("../../DB/models/post/post.repository");
const errors_1 = require("../../utils/errors");
const addreaction_provider_1 = require("../../utils/common/providers/addreaction.provider");
class PostService {
    postFactoryService = new factory_1.PostFactoryService();
    postRepository = new post_repository_1.PostRepository();
    create = async (req, res) => {
        // get data from req
        const createPostDTO = req.body;
        // prepare data - factory
        const post = this.postFactoryService.createPost(createPostDTO, req.user);
        // save data to database - repository
        await this.postRepository.create(post);
        // send response
        return res.status(201).json({ success: true, message: "post created successfully" });
    };
    addReaction = async (req, res) => {
        // get data from req
        const { id } = req.params;
        const userId = req.user._id;
        const { reaction } = req.body;
        // add reaction - provider
        await (0, addreaction_provider_1.addReactionProvider)(this.postRepository, id, userId, reaction);
        // send response
        return res.sendStatus(204);
    };
    getPostById = async (req, res) => {
        // get data from req
        const { id } = req.params;
        // check post existence
        const post = await this.postRepository.getById(id, {}, {
            populate: [
                { path: "userId", select: "firstName lastName fullName" },
                { path: "reactions.userId", select: "firstName lastName fullName" },
                { path: "comments", match: { directParentId: null } }
            ]
        });
        if (!post) {
            throw new errors_1.NotFoundException("post not found");
        }
        // send response
        return res.status(200).json({ success: true, post });
    };
    deletePost = async (req, res) => {
        // get data from req
        const { id } = req.params;
        // check post existence
        const post = await this.postRepository.getById(id);
        if (!post) {
            throw new errors_1.NotFoundException("post not found");
        }
        // check user authority
        if (post.userId.toString() !== req.user._id.toString()) {
            throw new errors_1.UnAuthorizedException("you are not authorized to delte this post");
        }
        // delete post
        await this.postRepository.deleteOne({ _id: id });
        // send response
        return res.status(200).json({ success: true, message: "post deleted successfully" });
    };
}
exports.PostService = PostService;
exports.default = new PostService();
