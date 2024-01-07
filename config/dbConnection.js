import mongoose from "mongoose";

mongoose.set('strictQuery',false)
const dbconnection = async () =>{
    try {
        const {connection} = await mongoose.connect(process.env.DB_URI || "mongodb://localhost:27017/Backend Project")
        if(connection){
            console.log(`Connected to MongoDB: ${connection.host}`)
        }
    } catch (error) {
        console.log("Fail to Connect Database",error)
        process.exit(1)
    }
}


export default dbconnection