import { Socket } from "socket.io"
import { verifyToken } from "../../utils/token"
import { UserRepository } from "../../DB/models/user/user.repository"
import { BadRequestException, NotFoundException } from "../../utils/errors"
import { ZodType } from "zod"

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

export const messageValidation = (schema: ZodType) => {
    return (socket: Socket, next: Function) => {
        try {
            let data = socket.data
            const { success, error } = schema.safeParse(data)
            if (!success) {
                let errMessages = error.issues.map((isssue) => ({
                    path: isssue.path[0],
                    message: isssue.message
                }))
                throw new BadRequestException("validation error", errMessages)
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}