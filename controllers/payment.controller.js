import Payment from "../models/payment.model.js"
import User from "../models/user.model.js"
import { razorpay } from "../server.js"
import AppError from "../utils/appError.js"
import crypto from 'crypto'

const getRazorpayApiKey = async (req,res,next) =>{
    try {
        res.status(200).json({
            success:true,
            message:'Razorpay API key',
            key: process.env.RAZORPAY_KEY_ID
        })
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}



const buySubscription = async (req,res,next) =>{
    try {
        const  { id } = req.user
        const user = await User.findById(id);
    
        if(!user){
            return next(new AppError('Unauthorized, please login'))
        }
    
        if(user.role ==="ADMIN"){
            return next(new AppError('Admin cannot purchase a subscription',400))
        }

        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify:1,
            total_count: 12,
        });

        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;

        await user.save();

        res.status(200).json({
            success:true,
            message: 'Subscribed Successfully',
            subscription_id: subscription.id
        })

    } catch (error) {
        return next(new AppError(error.message,500))
    }
}



const verifySubscription = async (req,res,next) =>{
    try {
        const { id } = req.user;
        const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id }  = req.body;
    
        const user = await User.findById(id);
    
        if(!user){
            return next(new AppError('Unauthorized, please login'))
        }

        const subscriptionId = user.subscription.id;

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(`${razorpay_payment_id}|${subscriptionId}`)
            .digest('hex');

        if(generatedSignature !== razorpay_signature){
            return next(new AppError('Payment not verified, please try again',500))
        }
        
        await Payment.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id
        })
        
        user.subscription.status = 'active'
        await user.save()

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully'
        })
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}



const cancelSubscription = async (req,res,next) =>{
    try {
        const { id } = req.user;
        const user = await User.findById(id)

        if(!user){
            return next(new AppError('Unauthorized, please login'))
        }
    
        if(user.role ==="ADMIN"){
            return next(new AppError('Admin cannot purchase a subscription',400))
        }

        const subscriptionId = user.subscription.id;
        const subscription = await razorpay.subscriptions.cancel(subscriptionId)

        user.subscription.status = subscription.status;

        await user.save();

        const payment = await Payment.findOne({razorpay_payment_id:subscription});

        const timeSinceSubscribed = Date.now() - payment.createdAt;
        const refunPeriod = 14 * 24 * 60 * 60 * 1000;

        if(refunPeriod<=timeSinceSubscribed){
            return next(new AppError('Refund period is over , so there will not be any refunds provided.',400))
        }

        await razorpay.payments.refund(payment.razorpay_payment_id,{
            speed:'optimum'
        })

        await user.save();
        await payment.remove();

        res.status(200).json({
            success: true,
            message: 'Subscription cancelled successfully'
        })
        
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}



const allPayments = async (req,res,next) =>{
    try {
        const {count , skip } = req.query;

        const allPayments = await razorpay.subscriptions.all({
            count:count ? count:10,
            skip: skip ? skip:0
        });
        
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        const finalMonths = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
        };

        const monthlyWisePayments = allPayments.items.map((payment)=>{
            const monthsInNumbers = new Date(payment.start_at * 1000);
            return monthNames[monthsInNumbers.getMonth()];
        });

        monthlyWisePayments.map((month)=>{
            Object.keys(finalMonths).forEach((objMonth)=>{
                if(month === objMonth){
                    finalMonths[month] += 1;
                }
            });
        });

        const monthlySalesRecord = [];

        Object.keys(finalMonths).forEach((monthName)=>{
            monthlySalesRecord.push(finalMonths[monthName]);
        });

        res.status(200).json({
            success:true,
            message: 'All payments',
            allPayments,
            finalMonths,
            monthlySalesRecord
        });
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}



export {
    getRazorpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayments
}