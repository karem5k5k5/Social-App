import { Request, Response } from "express";
import { CommnetRepository } from "../../DB/models/comment/comment.repository";
import { PostRepository } from "../../DB/models/post/post.repository";
import { NotFoundException } from "../../utils/errors";
import { IComment } from "../../utils/common/interfaces";
import { CreateCommentDTO } from "./comment.dto";
import { CommentFactoryService } from "./factory";

class CommentService {
    private readonly commentRepository = new CommnetRepository()
    private readonly postRepository = new PostRepository()
    private readonly commentFactoryService = new CommentFactoryService()
    public create = async (req: Request, res: Response) => {
        // get data from req
        const { id, postId } = req.params
        const createCommentDTO: CreateCommentDTO = req.body
        // check post existence
        const post = await this.postRepository.getById(postId)
        if (!post) {
            throw new NotFoundException("post not found")
        }
        // check (parent) comment existence
        let comment: IComment
        if (id) {
            comment = await this.commentRepository.getById(id)
            if (!comment) {
                throw new NotFoundException("comment not found")
            }
        }
        // prepare data - factory
        const newComment = this.commentFactoryService.createComment(createCommentDTO, req.user, post, comment)
        // save comment to db
        await this.commentRepository.create(newComment)
        // send response
        return res.status(201).json({ success: true, message: "comment created successfully" })
    }
}

export default new CommentService()