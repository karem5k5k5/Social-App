"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chat_repository_1 = require("../../DB/models/chat/chat.repository");
class ChatService {
    chatRepository = new chat_repository_1.ChatRepository();
    getChat = async (req, res) => {
        // get userId from req params
        const { userId } = req.params;
        // get chat that contains only the 2 users
        const chat = await this.chatRepository.getOne({
            users: { $all: [userId, req.user._id] }
        });
        // send response
        return res.status(200).json({ success: true, data: { chat } });
    };
}
exports.default = new ChatService();
