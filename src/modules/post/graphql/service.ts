import { PostRepository } from "../../../DB/models/post/post.repository"
import { graphqlAuthenticate } from "../../../middlewares/graphql/auth"
import { graphqlValidation } from "../../../middlewares/graphql/validation"
import { NotFoundException } from "../../../utils/errors"
import { postValidation } from "./schema"

export const getPostById = async (_, args, context) => {
    // authentication
    await graphqlAuthenticate(context)
    // validation
    graphqlValidation(postValidation, args)
    // service
    const postRepository = new PostRepository()
    const post = await postRepository.getById(args.id, {}, { populate: { path: "userId" } })
    if (!post) {
        throw new NotFoundException("post not found")
    }
    return {
        success: true,
        message: "done",
        data: post
    }
}