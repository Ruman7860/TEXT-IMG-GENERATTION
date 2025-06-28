import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { errorHandler } from "../error/error.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY);

export const signup = async (req,res,next) => {
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return next(errorHandler(400,"Please fill all the fields"));
    }

    try {
        const user = await User.findOne({email});
        if(user){
            return next(errorHandler(400,"User already exists"));
        }

        const hashedPassword = bcrypt.hashSync(password,12);
        const newUser = new User({
            name,
            email,
            password : hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({id : newUser._id},process.env.JWT_SECRET,{expiresIn : "1d"});

        return res.cookie("token",token,{
            httpOnly : true,
        }).status(201).json({
            success : true,
            message : "User created successfully",
            token,
            user : {...newUser._doc,password : undefined}
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req,res,next) => {  
    const {email,password} = req.body;
    if(!email || !password){
        return next(errorHandler(400,"Please fill all the fields"));
    }

    try {
        const user = await User.findOne({email});
        if(!user){
            return next(errorHandler(400,"User does not exists! Please signup"));
        }

        const isPasswordMatch = bcrypt.compareSync(password,user.password);
        if(!isPasswordMatch){
            return next(errorHandler(400,"Invalid credentials"));
        }

        const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn : "1d"});

        return res.cookie("token",token,{
            httpOnly : true,
        }).status(200).json({
            success : true,
            message : "User logged in successfully",
            token,
            user : {...user._doc,password : undefined}
        });
    }catch(error){
        next(error);
    }
}

export const logout = (req,res,next) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            success : true,
            message : "User logged out successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const refreshAccessToken = async (req,res,next) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(incomingRefreshToken){
        return next(errorHandler(401,"unauthorized request"));
    }
    
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.JWT_REFRESH_SECRET);

    

}

export const userCredits = async (req,res,next) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId);
        console.log("user_log",{...user._doc,password:undefined})
        res.status(200).json({
            success : true,
            credits : user.creditBalance,
            user : {...user._doc,password:undefined}
        })
    } catch (error) {
        next(error);
    }
}

export const stripePayInstance = async (req,res,next) => {
    try {
        // Amount should be in cents (e.g., $10 = 1000)
        const { amount, credits,token } = req.body;
        const user = await User.findById(req.userId);

        if (!Number.isInteger(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }

        const cardDetails = await stripe.tokens.retrieve(token);
        console.log(cardDetails);

        if(!cardDetails.card){
            return res.json(404).json({
                success : false,
                message : "Fill All card details"
            });
        }

    
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'usd',  // Change this to your desired currency
          payment_method_types: ['card'],
        });


        user.creditBalance += credits;
        await user.save();


        res.status(200).json({
            success : true,
            message : "Payment Successfull and credits get added",
            clientSecret: paymentIntent.client_secret,  // Send clientSecret to frontend
        });
    } catch (error) {
        return res.status(500).send({ 
            success : false,
            message: error.message 
        });
    }
}