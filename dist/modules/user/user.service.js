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
}
exports.UserService = UserService;
exports.default = new UserService();
