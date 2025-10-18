import { Server, Socket } from "socket.io"
import { MessageRepository } from "../../DB/models/message/message.repository"
import { ChatRepository } from "../../DB/models/chat/chat.repository"
import { ObjectId } from "mongoose"
import { UserRepository } from "../../DB/models/user/user.repository"

interface ISendMessage {
    message: string
    destId: string
}

export const sendMessage = (socket: Socket, io: Server, connectedUsers: Map<string, string>) => {
    return async (data: ISendMessage) => {
        // sender user id
        const sender = socket.data.user._id
        // check blocked users
        const userRepository = new UserRepository()
        const friend = await userRepository.getById(data.destId)
        if (friend.blockedUsers.includes(sender) || socket.data.user.blockedUsers.includes(data.destId)) {
            socket.emit("failMessage", { reponse: "user is blocked" })
        } else {
            // emit "successMessage" to sender
            socket.emit("successMessage", data)
            // emit "receiveMessage" to receiver
            const destSocket = connectedUsers.get(data.destId)
            io.to(destSocket).emit("receiveMessage", data)
            // save into db
            // create message
            const messageRepository = new MessageRepository()
            const message = await messageRepository.create({ content: data.message, sender })
            // save message into chat and create if not exists
            const chatRepository = new ChatRepository()
            const chat = await chatRepository.getOne({
                users: { $all: [data.destId, sender] }
            })
            if (!chat) {
                await chatRepository.create({
                    users: [data.destId, sender],
                    messages: [message._id as unknown as ObjectId]
                })
            } else {
                await chatRepository.updateOne({ _id: chat._id }, {
                    $push: { messages: message._id }
                })
            }
        }
    }
}