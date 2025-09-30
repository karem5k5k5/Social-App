import jwt, { JwtPayload } from "jsonwebtoken"
import { devConfig } from "../../config/env/dev.config"

export const generateToken = (id: string, options: jwt.SignOptions) => {
    return jwt.sign({ id }, devConfig.JWT_SECRET, options)
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, devConfig.JWT_SECRET) as JwtPayload
}