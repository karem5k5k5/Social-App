"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const middleware_1 = require("./middleware");
const console_1 = require("console");
const chat_1 = require("./chat");
const validation_1 = require("./validation");
const connectedUsers = new Map();
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    // socket.io - auth middleware
    io.use(middleware_1.socketAuth);
    // socket.io connection
    io.on("connection", (socket) => {
        // add user to connected users
        connectedUsers.set(socket.data.user.id, socket.id);
        (0, console_1.log)({ connectedUsers });
        // socket.io - validation middleware
        io.use((0, middleware_1.messageValidation)(validation_1.sendMessageSchema));
        // send message
        socket.on("sendMessage", (0, chat_1.sendMessage)(socket, io, connectedUsers));
    });
};
exports.initSocket = initSocket;
