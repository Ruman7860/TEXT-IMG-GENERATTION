import FormData from "form-data";
import dotenv from 'dotenv';
import { errorHandler } from "../error/error.js";
import User from "../models/user.model.js";
import axios from "axios";

dotenv.config();


export const generateImage = async (req,res,next) => {
    try {
        const {prompt} = req.body;
        const userId = req.userId;


        const user = await User.findById(userId);

        if(!user){
            return next(errorHandler(400,"User does not exists! Please signup"));
        }

        if(!prompt){
            return next(errorHandler(400,"Prompt not Provided"));
        }

        console.log("ZERO");

        if(user.creditBalance <= 0){
            return res.status(404).json({
                success : false,
                message : "No credit Balance! Purchase a plan",
                remainingCredits : user.creditBalance
            });
        }

        const formData = new FormData();
        formData.append('prompt',prompt);

        const {data} = await axios.post(
            'https://clipdrop-api.co/text-to-image/v1',
            formData,
            {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API,
                },
                responseType: 'arraybuffer'
            }
        );

        const base64Image = Buffer.from(data,'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;
        user.creditBalance -= 1;
        await user.save();

        res.status(200).json({
            success : true,
            success: true,
            message: "Image generated successfully.",
            resultImage: resultImage,
            remainingCredits: user.creditBalance,
        });
    } catch (error) {
        console.error('Error in generateImage:', error.message);
        next(error);
    }
}