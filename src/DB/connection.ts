import { log } from 'console';
import mongoose from 'mongoose';
import { devConfig } from '../config/env/dev.config';

export const connectDB = async () => {
    try {
        await mongoose.connect(devConfig.DB_URL as string);
        log("db is connected")
    } catch (error) {
        log("fail to connect to db", error)
    }
}