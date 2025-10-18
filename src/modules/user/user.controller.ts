import { Router } from "express";
import userService from "./user.service";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { isValid } from "../../middlewares/validation.middleware";
import { updateUserSchema } from "./user.validation";

const router = Router();

router.get("/:id", userService.getUserById)
router.patch("/update", isValid(updateUserSchema), isAuthenticated, userService.updateUser)
router.post("/send-friend-request/:friendId", isAuthenticated, userService.sendFriendRequest)
router.patch("/accept-request/:friendId", isAuthenticated, userService.acceptRequest)
router.delete("/reject-request/:friendId", isAuthenticated, userService.rejectRequest)
router.patch("/block/:id", isAuthenticated, userService.blockUser)
router.delete("/unfriend/:id",isAuthenticated,userService.unfriend)

export default router;