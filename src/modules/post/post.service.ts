import { Request, Response } from "express";
import { CreatePostDTO } from "./post.dto";
import { PostFactoryService } from "./factory";
import { PostRepository } from "../../DB/models/post/post.repository";
import { ForbiddenException, NotFoundException, UnAuthorizedException } from "../../utils/errors";
import { addReactionProvider } from "../../utils/common/providers/addreaction.provider";

export class PostService {
    private readonly postFactoryService = new PostFactoryService()
    private readonly postRepository = new PostRepository()

    public create = async (req: Request, res: Response) => {
        // get data from req
        const createPostDTO: CreatePostDTO = req.body
        // prepare data - factory
        const post = this.postFactoryService.createPost(createPostDTO, req.user)
        // save data to database - repository
        await this.postRepository.create(post)
        // send response
        return res.status(201).json({ success: true, message: "post created successfully" })
    }

    public addReaction = async (req: Request, res: Response) => {
        // get data from req
        const { id } = req.params
        const userId = req.user._id
        const { reaction } = req.body
        // add reaction - provider
        await addReactionProvider(this.postRepository, id, userId, reaction)
        // send response
        return res.sendStatus(204)
    }

    public getPostById = async (req: Request, res: Response) => {
        // get data from req
        const { id } = req.params
        // check post existence
        const post = await this.postRepository.getById(id, {}, {
            populate: [
                { path: "userId", select: "firstName lastName fullName" },
                { path: "reactions.userId", select: "firstName lastName fullName" },
                { path: "comments", match: { directParentId: null } }
            ]
        })
        if (!post) {
            throw new NotFoundException("post not found")
        }
        // check post freeze
        if (post.isFreezed) {
            throw new ForbiddenException("post is freezed")
        }
        // send response
        return res.status(200).json({ success: true, post })
    }

    public deletePost = async (req: Request, res: Response) => {
        // get data from req
        const { id } = req.params
        // check post existence
        const post = await this.postRepository.getById(id)
        if (!post) {
            throw new NotFoundException("post not found")
        }
        // check user authority
        if (post.userId.toString() !== req.user._id.toString()) {
            throw new UnAuthorizedException("you are not authorized to delte this post")
        }
        // delete post
        await this.postRepository.deleteOne({ _id: id })
        // send response
        return res.status(200).json({ success: true, message: "post deleted successfully" })
    }

    public freezePost = async (req: Request, res: Response) => {
        // get id from req params
        const { id } = req.params
        // check post existence
        const post = await this.postRepository.getById(id)
        if (!post) {
            throw new NotFoundException("post not found")
        }
        // update post
        post.isFreezed = true
        await this.postRepository.create(post)
        // send response
        return res.status(200).json({ success: true, message: "post freezed successfully" })
    }

    public restorePost = async (req: Request, res: Response) => {
        // get id from req params
        const { id } = req.params
        // check post existence
        const post = await this.postRepository.getById(id)
        if (!post) {
            throw new NotFoundException("post not found")
        }
        // update post
        post.isFreezed = false
        await this.postRepository.create(post)
        // send response
        return res.status(200).json({ success: true, message: "post restored successfully" })
    }
}

export default new PostService()