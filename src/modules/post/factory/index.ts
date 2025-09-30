import { IUser } from "../../../utils/common/interfaces";
import { Post } from "../entity";
import { CreatePostDTO } from "../post.dto";

export class PostFactoryService {
    createPost(createPostDTO: CreatePostDTO, user: IUser) {
        const post = new Post()

        post.content = createPostDTO.content
        post.userId = user._id
        post.reactions = []
        post.attachments = []

        return post
    }
}