import z from "zod";

export const sendMessageSchema = z.object({
    sender: z.string().length(24).regex(/^[0-9a-fA-F]{24}$/),
    message: z.string().min(2).max(1000)
})