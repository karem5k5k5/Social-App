import { Router } from "express";
import commentService from "./comment.service";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { isValid } from "../../middlewares/validation.middleware";
import { createCommentSchema } from "./comment.validation";

const router = Router({ mergeParams: true })

router.post("{/:id}", isValid(createCommentSchema), isAuthenticated, commentService.create)
router.get("/:id", commentService.getCommentById)
router.delete("/:id", isAuthenticated, commentService.deleteComment)
router.patch("/:id", isAuthenticated, commentService.addReaction)
router.patch("/freeze/:id", isAuthenticated, commentService.freezeComment)
router.patch("/restore/:id", isAuthenticated, commentService.restoreComment)

export default router