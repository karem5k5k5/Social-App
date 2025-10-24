import { UserRepository } from "../../DB/models/user/user.repository"
import { ForbiddenException, NotFoundException } from "../../utils/errors"
import { verifyToken } from "../../utils/token"

export const graphqlAuthenticate = async (context) => {
    // get token from graphql conntext
    const token = context.token
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
    // add user to context
    context.user = user
}