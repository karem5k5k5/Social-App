import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import postService from "./post.service";
import { isValid } from "../../middlewares/validation.middleware";
import { craetePostSchema } from "./post.validation";
import commentRouter from "../comment/comment.controller"

const router = Router()
// comment router
router.use("/:postId/comment", commentRouter)
// post routes
router.post("/", isValid(craetePostSchema), isAuthenticated, postService.create)
router.patch("/:id", isAuthenticated, postService.addReaction)
router.patch("/freeze/:id", isAuthenticated, postService.freezePost)
router.patch("/restore/:id", isAuthenticated, postService.restorePost)
router.delete("/:id", isAuthenticated, postService.deletePost)
// public
router.get("/:id", postService.getPostById)

export default router