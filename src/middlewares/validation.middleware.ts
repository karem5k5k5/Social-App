import { NextFunction, Request, Response } from "express"
import { BadRequestException } from "../utils/errors"
import { ZodType } from "zod"

export const isValid = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // validation
        let data = { ...req.body, ...req.params, ...req.query }
        const { success, error } = schema.safeParse(data)
        if (!success) {
            let errMessages = error.issues.map((isssue) => ({
                path: isssue.path[0],
                message: isssue.message
            }))
            throw new BadRequestException("validation error", errMessages)
        }
        next()
    }
}