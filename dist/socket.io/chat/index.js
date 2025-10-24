"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const message_repository_1 = require("../../DB/models/message/message.repository");
const chat_repository_1 = require("../../DB/models/chat/chat.repository");
const user_repository_1 = require("../../DB/models/user/user.repository");
const sendMessage = (socket, io, connectedUsers) => {
    return async (data) => {
        // sender user id
        const sender = socket.data.user._id;
        // check blocked users
        const userRepository = new user_repository_1.UserRepository();
        const friend = await userRepository.getById(data.destId);
        if (friend.blockedUsers.includes(sender) || socket.data.user.blockedUsers.includes(data.destId)) {
            socket.emit("failMessage", { reponse: "user is blocked" });
        }
        else {
            // emit "successMessage" to sender
            socket.emit("successMessage", data);
            // emit "receiveMessage" to receiver
            const destSocket = connectedUsers.get(data.destId);
            io.to(destSocket).emit("receiveMessage", data);
            // save into db
            // create message
            const messageRepository = new message_repository_1.MessageRepository();
            const message = await messageRepository.create({ content: data.message, sender });
            // save message into chat and create if not exists
            const chatRepository = new chat_repository_1.ChatRepository();
            const chat = await chatRepository.getOne({
                users: { $all: [data.destId, sender] }
            });
            if (!chat) {
                await chatRepository.create({
                    users: [data.destId, sender],
                    messages: [message._id]
                });
            }
            else {
                await chatRepository.updateOne({ _id: chat._id }, {
                    $push: { messages: message._id }
                });
            }
        }
    };
};
exports.sendMessage = sendMessage;
