import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    await mongoose.connect(process.env.CONN_STR)
    .then(()=>console.log("MongoDB connected successfully"))
    .catch((err) => console.log(err.message));
} 

export default connectDB;