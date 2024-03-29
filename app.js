config();
import {config} from 'dotenv'
import  express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors"
import morgan from "morgan";

import userRoutes from './routers/user.routers.js'
import courseRoutes from './routers/course.routers.js'
import errorMiddleware from "./middleware/error.middleware.js";
import paymentRoutes from './routers/payment.routers.js';
import miscRoutes from './routers/miscellaneous.routes.js'

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true
}))
app.use(morgan('dev'));
app.use(cookieParser())

app.get('/ping',(req,res)=>{
    res.send("/pong")
})

app.use('/api/v1/user',userRoutes)
app.use('/api/v1/courses',courseRoutes)
app.use('/api/v1/payments',paymentRoutes)
app.use('/api/v1', miscRoutes);

app.all('*',(req,res)=>{
    res.status(404).send("OOPS! 404 page not found")
})

app.use(errorMiddleware)

export default app