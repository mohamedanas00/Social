import { Router } from "express";
import * as authController from "./controller/auth.js"
const authRouter = Router()


authRouter.post("/signUp",authController.signUp)
authRouter.put("/confirmEmail",authController.confirmEmail)
authRouter.post("/logIn",authController.logIn)

export default authRouter