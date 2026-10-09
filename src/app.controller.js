import { connectDB } from "./DB/connectionDB.js"
import { authRouter, messageRputer, userRouter } from "./modules/index.js";
import { globalErrorHandler } from "./utils/response/error.response.js";

export const bootstrap = async (app , express)=>{
   app.use(express.json());
   await connectDB()

   app.use("/api/v1/auth" , authRouter)
   app.use("/api/v1/message" , messageRputer)
   app.use("/api/v1/user" , userRouter)

   app.use(globalErrorHandler);
} 