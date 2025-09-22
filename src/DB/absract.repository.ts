import { Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";

// repository design pattern
export abstract class AbstractRepository<T> {
    constructor(protected model: Model<T>) { }

    async create(item: Partial<T>) {
        const doc = new this.model(item)
        return await doc.save()
    }

    async getOne(filter: RootFilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>) {
        return await this.model.findOne(filter, projection, options)
    }

    async updateOne(filter: RootFilterQuery<T>, update: UpdateQuery<T>, options?: MongooseUpdateQueryOptions<T>) {
        return await this.model.updateOne(filter, update, options)
    }

    async deleteOne(filter: RootFilterQuery<T>) {
        await this.model.deleteOne(filter)
    }

    async getOneAndUpdate(filter: RootFilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions<T>) {
        return await this.model.findOneAndUpdate(filter, update, options)
    }
}