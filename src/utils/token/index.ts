import jwt from "jsonwebtoken"

export const generateToken = (id: string, options: jwt.SignOptions) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as jwt.Secret, options)
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET as jwt.Secret)
}