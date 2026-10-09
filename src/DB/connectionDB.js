import mongoose from "mongoose"
import { DB_URI } from "../../config/confog.service.js";

export const connectDB = async ()=>{
    try {
        mongoose.connection.on("connected" , ()=>{
            console.log("DB Connected Sucessfully");
        })
       await mongoose.connect(DB_URI , {serverSelectionTimeoutMS : 5000})
       console.log("Database name:", mongoose.connection.name);
    } catch (error) {
        console.log("error in connection DB" , error);
        
    }
}