import { GENDER } from "../../utils/common/enums"

export interface UpdateUserDTO {
    email?: string
    phoneNumber?: string
    fullName?: string
    gender?: GENDER
}