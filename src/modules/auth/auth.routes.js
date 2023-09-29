import { Router } from "express";
import * as authController from "./controller/auth.js"
import { validation } from "../../middleware/validation.js";
import * as validator from './auth.validation.js'

const authRouter = Router()


authRouter.post("/signUp", validation(validator.signUp), authController.signUp)
authRouter.put("/confirmEmail", validation(validator.confirmEmail), authController.confirmEmail)
authRouter.post("/logIn", validation(validator.logIn), authController.logIn)
authRouter.put('/restPassword', validation(validator.restPassword), authController.restPassword)
authRouter.route('/')
    .patch(validation(validator.sendCode), authController.sendCode)



export default authRouter