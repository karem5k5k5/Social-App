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
    async getById(id, projection, options) {
        return await this.model.findById(id, projection, options);
    }
    async updateOne(filter, update, options) {
        return await this.model.updateOne(filter, update, options);
    }
    async updateMany(filter, update, options) {
        return await this.model.updateMany(filter, update, options);
    }
    async deleteOne(filter, options) {
        return await this.model.deleteOne(filter, options);
    }
    async deleteMany(filter, options) {
        return await this.model.deleteMany(filter, options);
    }
    async getOneAndUpdate(filter, update, options) {
        return await this.model.findOneAndUpdate(filter, update, options);
    }
    async getOneAndDelete(filter, options) {
        return await this.model.findOneAndDelete(filter, options);
    }
}
exports.AbstractRepository = AbstractRepository;
