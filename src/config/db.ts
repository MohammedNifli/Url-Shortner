import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "";
console.log('mongo',mongoURI)
const connectDB = async (): Promise<void> => {
    try {
       const connected= await mongoose.connect(mongoURI);

        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDB;
