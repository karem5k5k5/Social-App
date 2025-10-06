import User from "../entity";
import { UpdateUserDTO } from "../user.dto";

export class UserFactoryService {
    async updateUser(updateUserDTO: UpdateUserDTO) {

        const user = new User()

        user.fullName = updateUserDTO.fullName ? updateUserDTO.fullName : user.fullName
        user.email = updateUserDTO.email ? updateUserDTO.email : user.email
        user.phoneNumber = updateUserDTO.phoneNumber ? updateUserDTO.phoneNumber : user.phoneNumber
        user.gender = updateUserDTO.gender ? updateUserDTO.gender : user.gender

        return user
    }
}
