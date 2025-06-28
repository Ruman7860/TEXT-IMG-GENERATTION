import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorHandler } from "../error/error.js";

dotenv.config();

export const verifyUser = async (req,res,next) => {
    console.log("")
    const token = req.cookies?.token;
    console.log("token",token)

    if(!token){
        return next(errorHandler(401, "Unauthorized: Token not found"));
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,decoded) => {
        if(err){
            console.log("error in jwt verify",err)
            return next(errorHandler(403, "Unauthorized: Invalid or expired token"));
        }

        req.userId = decoded.id;
        next();
    })
}