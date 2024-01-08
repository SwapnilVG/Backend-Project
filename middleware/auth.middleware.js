import AppError from "../utils/appError.js";
import JWT from 'jsonwebtoken'


const isLoggedIn = async (req,res,next) =>{
    const {token} = req.cookies;

    try {
        if(!token){
            throw new AppError("Unauthenticated Please login Again",401);
       }
   
       const userdetails = await JWT.verify(token,process.env.SECRET);
   
       req.user = userdetails;
       next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized',error});
    }
}

export {
    isLoggedIn
}