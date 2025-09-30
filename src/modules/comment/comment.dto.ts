import { IAttachment } from "../../utils/common/interfaces"

export interface CreateCommentDTO {
    content: string
    attachement?: IAttachment
}