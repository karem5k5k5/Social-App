import { UserRepository } from "../../DB/models/user/user.repository";
import { UserFactoryService } from "./factory";
import { ConflictException, ForbiddenException, NotFoundException } from "../../utils/errors";
import { Request, Response } from "express";
import { UpdateUserDTO } from "./user.dto";
import { ObjectId } from "mongoose";

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

    public sendFriendRequest = async (req: Request, res: Response) => {
        // get friend id from params
        const { friendId } = req.params
        // check friend existence
        const friend = await this.userRepository.getById(friendId)
        if (!friend) {
            throw new NotFoundException("friend not found")
        }
        // check block existence
        if (friend.blockedUsers.includes(req.user._id)) {
            throw new ForbiddenException("user is blocked")
        }
        if (req.user.blockedUsers.includes(friend._id)) {
            throw new ForbiddenException("friend is blocked")
        }
        // check if users are already friend
        if (friend.friends.includes(req.user._id)) {
            throw new ConflictException("users are already friends")
        }
        // check if user already has a request from friend 
        if (req.user.friendRequests.includes(friend._id)) {
            throw new ConflictException("user already has a request from friend")
        }
        // check if friend already has a request from user
        if (friend.friendRequests.includes(req.user._id)) {
            throw new ConflictException("friend already has a request from user")
        }
        // add friend request
        await this.userRepository.updateOne({ _id: friend._id }, { $addToSet: { friendRequests: req.user._id } })
        // send response
        return res.status(200).json({ success: true, message: "friend request sent successfully" })
    }

    public acceptRequest = async (req: Request, res: Response) => {
        // get friend id from req params
        const { friendId } = req.params
        // check friend existence
        const friend = await this.userRepository.getById(friendId)
        if (!friend) {
            throw new NotFoundException("friend not found")
        }
        const promise = Promise.all([
            // update user's friends
            this.userRepository.updateOne({ _id: req.user._id }, {
                // remove request from friendRequests
                $pull: { friendRequests: friendId },
                // add request to friends
                $addToSet: { friends: friendId }
            }),// update friend's friends
            this.userRepository.updateOne({ _id: friendId }, {
                // add request to friends
                $addToSet: { friends: req.user._id }
            })
        ])
        // handle promise
        await promise
        // send response
        return res.status(200).json({ success: true, message: "friend request accepted successfully" })
    }

    public rejectRequest = async (req: Request, res: Response) => {
        // get friend id from req params
        const { friendId } = req.params
        // update user's friendREquests
        await this.userRepository.updateOne({ _id: req.user._id }, {
            $pull: { friendRequests: friendId }
        })
        // send response
        return res.status(200).json({ success: true, message: "friend request rejected successfully" })
    }

    public blockUser = async (req: Request, res: Response) => {
        // get blockedUserId from req params
        const { id } = req.params
        // convert id into ObjectId
        const blockedUserId: ObjectId = id as unknown as ObjectId
        // add blocked user to user's bloackedUsers and delete it from friends if exists
        await this.userRepository.updateOne({ _id: req.user._id }, {
            // remove friend
            $pull: { friends: blockedUserId },
            // block user
            $addToSet: { blockedUsers: blockedUserId }
        })
        // send response
        return res.status(200).json({ success: true, message: "user blocked successfully" })
    }

    public unfriend = async (req: Request, res: Response) => {
        // get friend id from params
        const { id } = req.params
        // convert id into ObjectId
        const friendId: ObjectId = id as unknown as ObjectId
        // delete friend from user's friends
        await this.userRepository.updateOne({ _id: req.user._id }, {
            $pull: { friends: friendId }
        })
        // send response
        return res.status(200).json({ success: true, message: "user deleted from friends successfully" })
    }
}


export default new UserService()
