import express from "express";
import dotenv from "dotenv" ; 
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes"
dotenv.config();

const PORT = process.env.PORT! ; 
const app = express();
app.use(express.json());
app.get("/home" , (req , res)=>{
    res.send("Hello world");
})
app.use('/auth' , authRoutes)
app.listen(PORT , ()=>{
    console.log(`Server running on PORT ${PORT}`) , 
    connectDB();

})