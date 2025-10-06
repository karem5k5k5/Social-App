"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactoryService = void 0;
const entity_1 = __importDefault(require("../entity"));
class UserFactoryService {
    async updateUser(updateUserDTO) {
        const user = new entity_1.default();
        user.fullName = updateUserDTO.fullName ? updateUserDTO.fullName : user.fullName;
        user.email = updateUserDTO.email ? updateUserDTO.email : user.email;
        user.phoneNumber = updateUserDTO.phoneNumber ? updateUserDTO.phoneNumber : user.phoneNumber;
        user.gender = updateUserDTO.gender ? updateUserDTO.gender : user.gender;
        return user;
    }
}
exports.UserFactoryService = UserFactoryService;
