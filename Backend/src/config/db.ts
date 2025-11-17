import mongoose from "mongoose";


const connectDB  = async(): Promise<void> =>{
    try{
        console.log("THISSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",process.env.MONGO_URI!)
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
        console.log((error as any).message)
    }
}



export default connectDB;