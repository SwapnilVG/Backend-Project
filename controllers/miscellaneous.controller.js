import AppError from "../utils/appError.js";
import sendEmail from "../utils/sendEmail.js";
import User from '../models/user.model.js'

const contactUs = async(req,res,next)=>{
    try {
        const { name , email , message } = req.body;

        if(!name || !email || !message){
            return next(new AppError('Name, Email, Message are required'));
        }
    
        try {
            const subject = 'Contact Us Form';
            const textMessage = `${name} - ${email} <br /> ${message}`;
    
            await sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage);
        } catch (error) {
            console.log(error);
            return next(new AppError(error.message, 400));
        };
    
        res.status(200).json({
            success: true,
            message: 'Your request has been submitted successfully',
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    };
};


const userStats = async(req,res,next)=>{
    try {
        const allUsersCount = await User.countDocuments();

        const subscribedUsersCount = await User.countDocuments({
            'subscription.status':'active',
        });
        res.status(200).json({
            success: true,
            message: 'All registered users count',
            allUsersCount,
            subscribedUsersCount
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
};
export { contactUs ,  userStats}