import mongoose from "mongoose";

const dbURL: string = process.env.DB_URI || "";

const connectDB = async () => {
    try {
        mongoose.connect(dbURL).then((data: any) => {
            console.log(`MongoDB connected with ${data.connection.host}`);
        });
    } catch (error: any) {
        console.log(error.message);
        setTimeout(connectDB, 5000);
    }
};

export default connectDB;
