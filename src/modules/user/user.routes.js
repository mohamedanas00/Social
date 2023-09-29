import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as userController from "./controller/user.js"
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as validator from './user.validation.js'
const userRouter = Router()

userRouter.route('/')
    .get(auth(), validation(validator.getUserProfile), userController.getUserProfile)

userRouter.post("/addProfilePicture", auth()
    , fileUpload(fileValidation.image).single('image'),
    validation(validator.addProfilePicture),
    userController.addProfilePicture)


userRouter.post("/addCoverPictures", auth()
    , fileUpload(fileValidation.image).single('image'),
    validation(validator.addCoverPictures),
    userController.addCoverPictures)


userRouter.patch('/updatePassword', auth(), validation(validator.updatePassword), userController.updatePassword)
userRouter.patch('/softDelete', auth(), validation(validator.softDelete), userController.softDelete)


export default userRouter