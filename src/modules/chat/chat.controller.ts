import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import chatService from "./chat.service";

const router = Router()

router.get("/:userId", isAuthenticated, chatService.getChat)

export default router