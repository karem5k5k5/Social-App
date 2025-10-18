import { Request, Response } from "express";
import { CommnetRepository } from "../../DB/models/comment/comment.repository";
import { PostRepository } from "../../DB/models/post/post.repository";
import { ForbiddenException, NotFoundException, UnAuthorizedException } from "../../utils/errors";
import { IComment, IPost, IUser } from "../../utils/common/interfaces";
import { CreateCommentDTO } from "./comment.dto";
import { CommentFactoryService } from "./factory";
import { addReactionProvider } from "../../utils/common/providers/addreaction.provider";

class CommentService {
    private readonly commentRepository = new CommnetRepository()
    private readonly postRepository = new PostRepository()
    private readonly commentFactoryService = new CommentFactoryService()
    public create = async (req: Request, res: Response) => {
        // get data from req
        const { id, postId } = req.params
        const createCommentDTO: CreateCommentDTO = req.body
        // check post existence
        const post = await this.postRepository.getById(postId, {}, {
            populate: { path: "userId", select: "blockedUsers" }
        })
        if (!post) {
            throw new NotFoundException("post not found")
        }
        // check post freeze
        if (post.isFreezed) {
            throw new ForbiddenException("post is freezed")
        }
        // check user block
        const postOwner = post.userId as unknown as IUser
        if (postOwner.blockedUsers.includes(req.user._id)) {
            throw new UnAuthorizedException("user is blocked")
        }
        // check (parent) comment existence
        let comment: IComment
        if (id) {
            // check comment existence
            comment = await this.commentRepository.getById(id, {}, {
                populate: { path: "userId", select: "blockedUsers" }
            })
            if (!comment) {
                throw new NotFoundException("comment not found")
            }
            // check comment freeze
            if (comment.isFreezed) {
                throw new ForbiddenException("comment is freezed")
            }
            // check user block
            const commentOwner = comment.userId as unknown as IUser
            if (commentOwner.blockedUsers.includes(req.user._id)) {
                throw new UnAuthorizedException("user is blocked")
            }
        }
        // prepare data - factory
        const newComment = this.commentFactoryService.createComment(createCommentDTO, req.user, post, comment)
        // save comment to db
        await this.commentRepository.create(newComment)
        // send response
        return res.status(201).json({ success: true, message: "comment created successfully" })
    }

    public getCommentById = async (req: Request, res: Response) => {
        // get data from req
        const { id } = req.params
        // check comment existence
        const comment = await this.commentRepository.getById(id, {}, {
            populate: [
                { path: "replies", match: { directParentId: id } }
            ]
        })
        if (!comment) {
            throw new NotFoundException("comment not found")
        }
        // check comment freeze
        if (comment.isFreezed) {
            throw new ForbiddenException("comment is freezed")
        }
        // send response
        return res.status(200).json({ success: true, comment })
    }

    public deleteComment = async (req: Request, res: Response) => {
        // get data from req
        const { id } = req.params
        // check comment existence
        const comment = await this.commentRepository.getById(id, {}, {
            populate: [
                { path: "postId", select: "userId" }
            ]
        })
        if (!comment) {
            throw new NotFoundException("comment not found")
        }
        // check user authority
        if (comment.userId.toString() !== req.user._id.toString() || (comment.postId as unknown as IPost).userId.toString() !== req.user._id.toString()) {
            throw new UnAuthorizedException("you are not authorized to delte this post")
        }
        // delete comment
        await this.commentRepository.deleteOne({ _id: id })
        // send response
        return res.status(200).json({ success: true, message: "comment deleted successfully" })
    }

    public addReaction = async (req: Request, res: Response) => {
        // get data from req
        const { id } = req.params
        const userId = req.user._id
        const { reaction } = req.body
        // add reaction - provider
        await addReactionProvider(this.commentRepository, id, userId, reaction)
        // send response
        return res.sendStatus(204)
    }

    public freezeComment = async (req: Request, res: Response) => {
        // get id from req params
        const { id } = req.params
        // check comment existence
        const comment = await this.commentRepository.getById(id)
        if (!comment) {
            throw new NotFoundException("comment not found")
        }
        // update comment
        comment.isFreezed = true
        await this.commentRepository.create(comment)
        // send response
        return res.status(200).json({ success: true, message: "comment freezed successfully" })
    }

    public restoreComment = async (req: Request, res: Response) => {
        // get id from req params
        const { id } = req.params
        // check comment existence
        const comment = await this.commentRepository.getById(id)
        if (!comment) {
            throw new NotFoundException("comment not found")
        }
        // update comment
        comment.isFreezed = false
        await this.commentRepository.create(comment)
        // send response
        return res.status(200).json({ success: true, message: "comment restored successfully" })
    }
}

export default new CommentService()