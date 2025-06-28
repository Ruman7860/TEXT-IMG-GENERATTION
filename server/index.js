import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/connectDB.js';
import userRouter from './routes/user.route.js';
import imageRouter from './routes/image.routes.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin : process.env.FRONTEND_URL,
    methods : ["GET","POST","PATCH","PUT","DELETE"],
    credentials : true
}));
app.use(cookieParser());

const port = process.env.PORT || 3000;

console.log("FRONTEND_URL",process.env.FRONTEND_URL);

// connection mongodb to our express server
await connectDB();

app.get('/',(req,res) => {
    res.send("hello from server")
});

app.use('/api/v1/auth/',userRouter);
app.use('/api/v1/image/',imageRouter);

// global error handler middleware
app.use((error,req,res,next) => {
    const status = error.statusCode || 500;
    const message = error.errorMessage || "Internal Server Issue";
    return res.status(status).json({
        success : false,
        message 
    })
});

app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
});