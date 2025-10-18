import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/token";
import { UserRepository } from "../DB/models/user/user.repository";
import { ForbiddenException, NotFoundException } from "../utils/errors";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    // get token from req headers
    const token = req.headers.authorization as string
    // verify token and get user id
    const { id } = verifyToken(token)
    // check user existence
    const userRepository = new UserRepository()
    const user = await userRepository.getById(id)
    if (!user) {
        throw new NotFoundException("user not found")
    }
    // check token validation
    if (token != user.token) {
        throw new ForbiddenException("invalid token")
    }
    // add user to req
    req.user = user
    // call next
    next()
}