import { Document, Model, MongooseBaseQueryOptions, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";

// repository design pattern
export abstract class AbstractRepository<T> {
    constructor(protected model: Model<T>) { }

    async create(item: Partial<T>) {
        const doc = new this.model(item)
        doc["isNew"] = true
        return await doc.save() as Document<T>
    }

    async getOne(filter: RootFilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>) {
        return await this.model.findOne(filter, projection, options)
    }

    async getById(id: any, projection?: ProjectionType<T>, options?: QueryOptions<T>) {
        return await this.model.findById(id, projection, options)
    }

    async updateOne(filter: RootFilterQuery<T>, update: UpdateQuery<T>, options?: MongooseUpdateQueryOptions<T>) {
        return await this.model.updateOne(filter, update, options)
    }

    async updateMany(filter: RootFilterQuery<T>, update: UpdateQuery<T>, options?: MongooseUpdateQueryOptions<T>) {
        return await this.model.updateMany(filter, update, options)
    }

    async deleteOne(filter: RootFilterQuery<T>, options?: MongooseBaseQueryOptions<T>) {
        return await this.model.deleteOne(filter, options)
    }

    async deleteMany(filter: RootFilterQuery<T>, options?: MongooseBaseQueryOptions<T>) {
        return await this.model.deleteMany(filter, options)
    }

    async getOneAndUpdate(filter: RootFilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions<T>) {
        return await this.model.findOneAndUpdate(filter, update, options)
    }

    async getOneAndDelete(filter: RootFilterQuery<T>, options?: QueryOptions<T>) {
        return await this.model.findOneAndDelete(filter, options)
    }
}