"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const absract_repository_1 = require("../../absract.repository");
const post_model_1 = require("./post.model");
class PostRepository extends absract_repository_1.AbstractRepository {
    constructor() {
        super(post_model_1.Post);
    }
}
exports.PostRepository = PostRepository;
