"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostById = void 0;
const post_repository_1 = require("../../../DB/models/post/post.repository");
const auth_1 = require("../../../middlewares/graphql/auth");
const validation_1 = require("../../../middlewares/graphql/validation");
const errors_1 = require("../../../utils/errors");
const schema_1 = require("./schema");
const getPostById = async (_, args, context) => {
    // authentication
    await (0, auth_1.graphqlAuthenticate)(context);
    // validation
    (0, validation_1.graphqlValidation)(schema_1.postValidation, args);
    // service
    const postRepository = new post_repository_1.PostRepository();
    const post = await postRepository.getById(args.id, {}, { populate: { path: "userId" } });
    if (!post) {
        throw new errors_1.NotFoundException("post not found");
    }
    return {
        success: true,
        message: "done",
        data: post
    };
};
exports.getPostById = getPostById;
