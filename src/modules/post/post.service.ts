import { Request, Response } from "express";
import { CreatePostDTO } from "./post.dto";
import { PostFactoryService } from "./factory";
import { PostRepository } from "../../DB/models/post/post.repository";
import { NotFoundException } from "../../utils/errors";

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
        // check post existence
        const post = await this.postRepository.getById(id)
        if (!post) {
            throw new NotFoundException("post not found")
        }
        // update post
        const userReactedIndex = post.reactions.findIndex((reaction) => {
            return reaction.userId.toString() == userId.toString()
        })
        if (userReactedIndex == -1) {
            await this.postRepository.updateOne({ _id: id }, { $push: { reactions: { reaction, userId } } })
        } else if ([undefined, null, ""].includes(reaction)) {
            await this.postRepository.updateOne({ _id: id }, { $pull: { reactions: post.reactions[userReactedIndex] } })
        } else {
            await this.postRepository.updateOne({ _id: id, "reactions.userId": userId }, { "reactions.$.reaction": reaction })
        }

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
                { path: "comments" }
            ]
        })
        if (!post) {
            throw new NotFoundException("post not found")
        }
        // send response
        return res.status(200).json({ success: true, post })
    }
}

export default new PostService()