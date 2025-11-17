import mongoose from "mongoose";


const connectDB  = async(): Promise<void> =>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI!);
        console.log("MONGO DB connected !!!");
    }
    catch(error){
        if(error instanceof Error){
            console.log(error)
        }
        else{
            console.log("Unknown error occured");
        }
        console.error('Problems while connecting to mongodb');
    }
}



export default connectDB;