import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        
        if (!process.env.MONGO_URI) {
            throw new Error("MongoDB URI is not defined in environment variables");
        }

        
        const connection = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        
        console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
        throw error; 
    }
};

export { connectDB };
