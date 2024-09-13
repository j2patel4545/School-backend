import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

export const DatabaseConnection = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/foram`);
        console.log("Database Connected Successfully!");
    } catch (error) {
        console.log("Database NOT Connected!");
        console.log(error);
    }
};
