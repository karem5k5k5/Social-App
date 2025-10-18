import { Socket } from "socket.io"
import { verifyToken } from "../../utils/token"
import { UserRepository } from "../../DB/models/user/user.repository"
import { NotFoundException } from "../../utils/errors"

export const socketAuth = async (socket: Socket, next: Function) => {
    try {
        // get token from socket 
        const { authorization } = socket.handshake.auth
        // verify token and get payload
        const { id } = verifyToken(authorization)
        // check user existence
        const userRepository = new UserRepository()
        const user = await userRepository.getById(id)
        if (!user) {
            throw new NotFoundException("user not found")
        }
        // add user to socket data
        socket.data.user = user
        // call next
        next()
    } catch (error) {
        next(error)
    }
}