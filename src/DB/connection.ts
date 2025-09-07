import { log } from 'console';
import  mongoose  from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL as string);
        log("db is connected")
    } catch (error) {
        log("fail to connect to db",error)
    }
}