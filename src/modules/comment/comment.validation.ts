import { z } from "zod";
import { CreateCommentDTO } from "./comment.dto";

export const createCommentSchema = z.object<CreateCommentDTO>({
    content: z.string().min(2) as unknown as string
})

