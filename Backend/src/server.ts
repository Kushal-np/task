import express from "express";
import dotenv from "dotenv" ; 
import connectDB from "./config/db";


const app = express();

app.get("/home" , (req , res)=>{
    res.send("Hello world");
})

app.listen(8000 , ()=>{
    console.log("Hello world") , 
    connectDB();

})