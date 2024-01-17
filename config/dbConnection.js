import mongoose from "mongoose";

mongoose.set('strictQuery',false)
const dbconnection = async () =>{
    try {
        const {connection} = await mongoose.connect(process.env.DB_URI || "mongodb://127.0.0.1:27017/Backend_Project")
        if(connection){
            console.log(`Connected to MongoDB: ${connection.host}`)
        }
    } catch (error) {
        console.log("Fail to Connect Database",error)
        process.exit(1)
    }
}


export default dbconnection