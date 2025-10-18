import { IMessage } from "../../../utils/common/interfaces";
import { AbstractRepository } from "../../absract.repository";
import { Message } from "./message.model";

export class MessageRepository extends AbstractRepository<IMessage> {
    constructor() {
        super(Message)
    }
}