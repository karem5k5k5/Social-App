import { Server as httpServer } from "http";
import { Server, Socket } from "socket.io";
import { socketAuth } from "./middleware";
import { log } from "console";
import { sendMessage } from "./chat";

const connectedUsers = new Map<string, string>()

export const initSocket = (server: httpServer) => {
    const io = new Server(server, { cors: { origin: "*" } })

    // socket.io - auth middleware
    io.use(socketAuth)

    // socket.io connection
    io.on("connection", (socket: Socket) => {
        // add user to connected users
        connectedUsers.set(socket.data.user.id, socket.id)
        log({ connectedUsers })
        // send message
        socket.on("sendMessage", sendMessage(socket, io, connectedUsers))
    })
}