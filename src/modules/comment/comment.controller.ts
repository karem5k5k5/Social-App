import { Router } from "express";
import commentService from "./comment.service";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = Router({ mergeParams: true })

router.post("{/:id}", isAuthenticated, commentService.create)

export default router