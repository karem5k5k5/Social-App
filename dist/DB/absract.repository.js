"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
// repository design pattern
class AbstractRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(item) {
        const doc = new this.model(item);
        return await doc.save();
    }
    async getOne(filter, projection, options) {
        return await this.model.findOne(filter, projection, options);
    }
    async updateOne(filter, update, options) {
        return await this.model.updateOne(filter, update, options);
    }
    async deleteOne(filter) {
        await this.model.deleteOne(filter);
    }
}
exports.AbstractRepository = AbstractRepository;
