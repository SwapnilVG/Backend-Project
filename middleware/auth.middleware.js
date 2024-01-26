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

const authorizedRoles = (...roles) => async (req,res,next)=>{
    const currentUserRole = req.user.role;
    if(!roles.includes(currentUserRole)){
        return next(new AppError('You do not have permissdion to access this route'))
    }
    next()
}



const authorizeSubscriber = async(req,res,next)=>{
    const subscription = req.user.subscription;
    const currentUserRole = req.user.role;

    if(currentUserRole !=='ADMIN' && subscription.status !== 'active'){
        return next(new AppError('Please subscribe to access this route!',403))
    }

    next()
}



export {
    isLoggedIn,authorizedRoles,authorizeSubscriber
}