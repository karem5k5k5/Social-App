import { IComment } from "../../../utils/common/interfaces";
import { AbstractRepository } from "../../absract.repository";
import { Comment } from "./comment.model";

export class CommnetRepository extends AbstractRepository<IComment> {
    constructor() {
        super(Comment)
    }
}