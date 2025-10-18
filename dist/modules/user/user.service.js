"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../../DB/models/user/user.repository");
const factory_1 = require("./factory");
const errors_1 = require("../../utils/errors");
class UserService {
    userRepository = new user_repository_1.UserRepository();
    userFactoryService = new factory_1.UserFactoryService();
    getUserById = async (req, res) => {
        // get data from req
        const { id } = req.params;
        // check user existence
        const user = await this.userRepository.getById(id);
        if (!user) {
            throw new errors_1.NotFoundException("user not found");
        }
        // send response
        return res.status(200).json({ success: true, user });
    };
    updateUser = async (req, res) => {
        // get data from req
        const updateUserDTO = req.body;
        // check email and phone number uniqueness
        if (updateUserDTO.email || updateUserDTO.phoneNumber) {
            const user = await this.userRepository.getOne({ $or: [{ email: updateUserDTO.email }, { phoneNumber: updateUserDTO.phoneNumber }] });
            if (user) {
                throw new errors_1.ConflictException("user already exists");
            }
        }
        // update user
        const updatedUser = await this.userFactoryService.updateUser(updateUserDTO);
        // save user to db
        await this.userRepository.create(updatedUser);
        // send response
        return res.status(200).json({ success: true, message: "user updated successfully" });
    };
    sendFriendRequest = async (req, res) => {
        // get friend id from params
        const { friendId } = req.params;
        // check friend existence
        const friend = await this.userRepository.getById(friendId);
        if (!friend) {
            throw new errors_1.NotFoundException("friend not found");
        }
        // check block existence
        if (friend.blockedUsers.includes(req.user._id)) {
            throw new errors_1.ForbiddenException("user is blocked");
        }
        if (req.user.blockedUsers.includes(friend._id)) {
            throw new errors_1.ForbiddenException("friend is blocked");
        }
        // check if users are already friend
        if (friend.friends.includes(req.user._id)) {
            throw new errors_1.ConflictException("users are already friends");
        }
        // check if user already has a request from friend 
        if (req.user.friendRequests.includes(friend._id)) {
            throw new errors_1.ConflictException("user already has a request from friend");
        }
        // check if friend already has a request from user
        if (friend.friendRequests.includes(req.user._id)) {
            throw new errors_1.ConflictException("friend already has a request from user");
        }
        // add friend request
        await this.userRepository.updateOne({ _id: friend._id }, { $addToSet: { friendRequests: req.user._id } });
        // send response
        return res.status(200).json({ success: true, message: "friend request sent successfully" });
    };
    acceptRequest = async (req, res) => {
        // get friend id from req params
        const { friendId } = req.params;
        // check friend existence
        const friend = await this.userRepository.getById(friendId);
        if (!friend) {
            throw new errors_1.NotFoundException("friend not found");
        }
        const promise = Promise.all([
            // update user's friends
            this.userRepository.updateOne({ _id: req.user._id }, {
                // remove request from friendRequests
                $pull: { friendRequests: friendId },
                // add request to friends
                $addToSet: { friends: friendId }
            }), // update friend's friends
            this.userRepository.updateOne({ _id: friendId }, {
                // add request to friends
                $addToSet: { friends: req.user._id }
            })
        ]);
        // handle promise
        await promise;
        // send response
        return res.status(200).json({ success: true, message: "friend request accepted successfully" });
    };
    rejectRequest = async (req, res) => {
        // get friend id from req params
        const { friendId } = req.params;
        // update user's friendREquests
        await this.userRepository.updateOne({ _id: req.user._id }, {
            $pull: { friendRequests: friendId }
        });
        // send response
        return res.status(200).json({ success: true, message: "friend request rejected successfully" });
    };
    blockUser = async (req, res) => {
        // get blockedUserId from req params
        const { id } = req.params;
        // convert id into ObjectId
        const blockedUserId = id;
        // add blocked user to user's bloackedUsers and delete it from friends if exists
        await this.userRepository.updateOne({ _id: req.user._id }, {
            // remove friend
            $pull: { friends: blockedUserId },
            // block user
            $addToSet: { blockedUsers: blockedUserId }
        });
        // send response
        return res.status(200).json({ success: true, message: "user blocked successfully" });
    };
    unfriend = async (req, res) => {
        // get friend id from params
        const { id } = req.params;
        // convert id into ObjectId
        const friendId = id;
        // delete friend from user's friends
        await this.userRepository.updateOne({ _id: req.user._id }, {
            $pull: { friends: friendId }
        });
        // send response
        return res.status(200).json({ success: true, message: "user deleted from friends successfully" });
    };
}
exports.UserService = UserService;
exports.default = new UserService();
