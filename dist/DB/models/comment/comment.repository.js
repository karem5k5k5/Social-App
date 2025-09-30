"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommnetRepository = void 0;
const absract_repository_1 = require("../../absract.repository");
const comment_model_1 = require("./comment.model");
class CommnetRepository extends absract_repository_1.AbstractRepository {
    constructor() {
        super(comment_model_1.Comment);
    }
}
exports.CommnetRepository = CommnetRepository;
