import { IPost } from "../../../utils/common/interfaces";
import { AbstractRepository } from "../../absract.repository";
import { Post } from "./post.model";

export class PostRepository extends AbstractRepository<IPost> {
    constructor() {
        super(Post)
    }
}