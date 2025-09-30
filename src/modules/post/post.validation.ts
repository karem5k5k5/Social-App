import { z } from "zod";
import { CreatePostDTO } from "./post.dto";

export const craetePostSchema = z.object<CreatePostDTO>({
    content: z.string().min(2) as unknown as string
})

