import connectDB from "../DB/connection.js"
import authRouter from "./modules/auth/auth.routes.js"
import userRouter from "./modules/user/user.routes.js"
import { globalErrorHandling } from "./utils/errorHandling.js"


const initApp =(app,express)=>{
    app.use(express.json())
    app.use('/auth',authRouter)
    app.use('/user',userRouter)
    app.use(globalErrorHandling)


    connectDB()
}


export default initApp