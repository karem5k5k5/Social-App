import { UserRepository } from "../../DB/models/user/user.repository";
import { UserFactoryService } from "./factory";
import { ConflictException, NotFoundException } from "../../utils/errors";
import { Request, Response } from "express";
import { UpdateUserDTO } from "./user.dto";

export class UserService {
    private readonly userRepository = new UserRepository()
    private readonly userFactoryService = new UserFactoryService()

    public getUserById = async (req: Request, res: Response) => {
        // get data from req
        const { id } = req.params
        // check user existence
        const user = await this.userRepository.getById(id)
        if (!user) {
            throw new NotFoundException("user not found")
        }
        // send response
        return res.status(200).json({ success: true, user })
    }

    public updateUser = async (req: Request, res: Response) => {
        // get data from req
        const updateUserDTO: UpdateUserDTO = req.body
        // check email and phone number uniqueness
        if (updateUserDTO.email || updateUserDTO.phoneNumber) {
            const user = await this.userRepository.getOne({ $or: [{ email: updateUserDTO.email }, { phoneNumber: updateUserDTO.phoneNumber }] })
            if (user) {
                throw new ConflictException("user already exists")
            }
        }
        // update user
        const updatedUser = await this.userFactoryService.updateUser(updateUserDTO)
        // save user to db
        await this.userRepository.create(updatedUser)
        // send response
        return res.status(200).json({ success: true, message: "user updated successfully" })
    }
}


export default new UserService()
