"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const factory_1 = require("./factory");
const post_repository_1 = require("../../DB/models/post/post.repository");
const errors_1 = require("../../utils/errors");
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
        // check post existence
        const post = await this.postRepository.getById(id);
        if (!post) {
            throw new errors_1.NotFoundException("post not found");
        }
        // update post
        const userReactedIndex = post.reactions.findIndex((reaction) => {
            return reaction.userId.toString() == userId.toString();
        });
        if (userReactedIndex == -1) {
            await this.postRepository.updateOne({ _id: id }, { $push: { reactions: { reaction, userId } } });
        }
        else if ([undefined, null, ""].includes(reaction)) {
            await this.postRepository.updateOne({ _id: id }, { $pull: { reactions: post.reactions[userReactedIndex] } });
        }
        else {
            await this.postRepository.updateOne({ _id: id, "reactions.userId": userId }, { "reactions.$.reaction": reaction });
        }
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
                { path: "comments" }
            ]
        });
        if (!post) {
            throw new errors_1.NotFoundException("post not found");
        }
        // send response
        return res.status(200).json({ success: true, post });
    };
}
exports.PostService = PostService;
exports.default = new PostService();
