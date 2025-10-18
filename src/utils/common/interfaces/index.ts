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
    friendRequests: ObjectId[]
    friends: ObjectId[]
    blockedUsers: ObjectId[]
    token: string
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
    isFreezed: boolean
}

export interface IComment {
    _id: ObjectId
    userId: ObjectId
    postId: ObjectId
    parentIds: ObjectId[]
    directParentId: ObjectId | null
    content: string
    attachment?: IAttachment
    reactions: IReaction[]
    mentions?: ObjectId[]
    isFreezed: boolean
}

export interface IMessage {
    _id: ObjectId
    content: string
    attachments?: IAttachment[]
    reactions: IReaction[]
    sender: ObjectId
}

export interface IChat {
    _id: ObjectId
    users: ObjectId[]
    messages: ObjectId[]
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