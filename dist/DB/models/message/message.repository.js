"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const absract_repository_1 = require("../../absract.repository");
const message_model_1 = require("./message.model");
class MessageRepository extends absract_repository_1.AbstractRepository {
    constructor() {
        super(message_model_1.Message);
    }
}
exports.MessageRepository = MessageRepository;
