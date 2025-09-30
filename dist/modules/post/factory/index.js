"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostFactoryService = void 0;
const entity_1 = require("../entity");
class PostFactoryService {
    createPost(createPostDTO, user) {
        const post = new entity_1.Post();
        post.content = createPostDTO.content;
        post.userId = user._id;
        post.reactions = [];
        post.attachments = [];
        return post;
    }
}
exports.PostFactoryService = PostFactoryService;
