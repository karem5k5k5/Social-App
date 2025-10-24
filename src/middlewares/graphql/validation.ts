import { ZodType } from "zod"
import { BadRequestException } from "../../utils/errors"

export const graphqlValidation = (schema: ZodType, args: any) => {
    // validation
    let data = args
    const { success, error } = schema.safeParse(data)
    if (!success) {
        let errMessages = error.issues.map((isssue) => ({
            path: isssue.path[0],
            message: isssue.message
        }))
        throw new BadRequestException("validation error", errMessages)
    }
}