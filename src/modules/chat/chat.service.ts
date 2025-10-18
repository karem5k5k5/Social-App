import { Request, Response } from "express"
import { ChatRepository } from "../../DB/models/chat/chat.repository"

class ChatService {
    private readonly chatRepository = new ChatRepository()
    public getChat = async (req: Request, res: Response) => {
        // get userId from req params
        const { userId } = req.params
        // get chat that contains only the 2 users
        const chat = await this.chatRepository.getOne({
            users: { $all: [userId, req.user._id] }
        })
        // send response
        return res.status(200).json({ success: true, data: { chat } })
    }
}

export default new ChatService()