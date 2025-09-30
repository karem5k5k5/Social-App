import { ObjectId } from "mongoose"
import { GENDER, REACTION, SYS_ROLE, USER_AGENT } from "../enums"

export interface IUser {
    _id: ObjectId
    firstName?: string
    lastName?: string
    email: string
    password: string
    credentialsUpdatedAt: Date
    isVerified: boolean
    phoneNumber?: string
    otp?: string
    otpExpire?: Date
    fullName?: string
    age?: string
    role: SYS_ROLE
    gender: GENDER
    userAgent: USER_AGENT
}

export interface IAttachment {
    url: string
    id: string
}

export interface IReaction {
    reaction: REACTION
    userId: ObjectId
}

export interface IPost {
    _id: ObjectId
    userId: ObjectId
    content: string
    attachments?: IAttachment[]
    reactions: IReaction[]
}

export interface IComment {
    _id: ObjectId
    userId: ObjectId
    postId: ObjectId
    parentIds: ObjectId[]
    content: string
    attachment?: IAttachment
    reactions: IReaction[]
    mentions?: ObjectId[]
}

declare module "express" {
    interface Request {
        user: IUser
    }
}

declare module "jsonwebtoken" {
    interface JwtPayload {
        id: string
    }
}