import app from "./app.js";
import dbconnection from "./config/dbConnection.js";
const PORT = process.env.PORT || 8000


app.listen(PORT, async()=>{
    await dbconnection();
    console.log(`App is running at http://localhost:${PORT}`)
})