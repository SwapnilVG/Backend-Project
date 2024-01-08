import User from "../models/user.model.js";
import AppError from "../utils/appError.js";

const cookieOptions = {
    secure:process.env.NODE_ENV == 'production' ? true : false,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
}

const register = async (req,res,next) =>{
    try {
        const { fullname , email ,password } = req.body;
    
        if(!fullname || !email || !password){
            return next(new AppError('All fiels are required',400))
        }
    
        const userExists = await User.findOne({email})
        if(userExists){
            return next( new AppError("Email already exists",400));
        }
    
        const user = await User.create({
            fullname,
            email,
            password,
            avatar:{
                public_id:email,
                secure_url:
                'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
    
            }
    
        })
    
        if(!user){
            return next(
                new AppError('User registration failed, please try again later', 400)
            )
        }
    
        // TODO file upload
    
        await user.save();
    
        user.password = undefined
        const token = await user.generateJWTToken
    
        res.cookie('token',token,cookieOptions)
        res.status(201).json({
            success:true,
            message:'User registered successfully',
            user
        })
        
    } catch (error) {
        return next(new AppError(error.message,500))
    } 
}

const login = async (req,res,next) =>{
    try {
        const {email,password } = req.body;
    
        if(!email || !password){
            return next(new AppError('All fields are required', 400));
        }
    
        const user = await User.findOne({email}).select('+password');
        if(!user || !user.comparePassword(password)){
            return next(new AppError('Email or password does not match', 401));
        }

        const token = await user.generateJWTToken();
        user.password = undefined
        res.cookie('token',token, cookieOptions);

        res.status(200).json({
            success:true,
            message:'User loggedin Successfully',
            user,
        })
        
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}


const logout = (req,res) =>{
    try {
        res.cookie('token',null,{    
            secure:process.env.NODE_ENV == 'production' ? true : false,
            maxAge:0,
            httpOnly:true         
        });

        res.status(200).json({
            success:true,
            message:'User logged out Successfully'
        })

    } catch (error) {
        return next(new AppError(error.message,500))
    }
}


const getProfile =  async(req,res,next) =>{
    try {
        const userid = req.user.id;
        const user =  await User.findById(userid);

        res.status(200).json({
            success:true,
        message: "User details",
        user
        })
    } catch (error) {
        return next(new AppError('Failed to fetch profile',500))
    }
}


export {register,login,logout,getProfile}