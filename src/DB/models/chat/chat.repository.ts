import { IChat } from "../../../utils/common/interfaces";
import { AbstractRepository } from "../../absract.repository";
import { Chat } from "./chat.model";

export class ChatRepository extends AbstractRepository<IChat> {
    constructor() {
        super(Chat)
    }
}