import { Router } from "express";
import userService from "./user.service";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { isValid } from "../../middlewares/validation.middleware";
import { updateUserSchema } from "./user.validation";

const router = Router();

router.get("/:id", userService.getUserById)
router.patch("/update", isValid(updateUserSchema), isAuthenticated, userService.updateUser)

export default router;