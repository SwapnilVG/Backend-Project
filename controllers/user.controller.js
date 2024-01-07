import User from "../models/user.model.js";
import AppError from "../utils/appError.js";

const cookieOptions = {
    secure:process.env.NODE_ENV == 'production' ? true : false,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
}

const register = async (req,res) =>{ 
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
}

const login = (req,res) =>{

}

const logout = (req,res) =>{

}


const getProfile = (req,res) =>{

}


export {register,login,logout,getProfile}