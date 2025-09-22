import { IUser } from "../../../utils/common/interfaces";
import { AbstractRepository } from "../../absract.repository";
import { User } from "./user.model";

export class UserRepository extends AbstractRepository<IUser> {
    constructor() {
        super(User)
    }  
}