import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as userController from "./controller/user.js"
import auth from "../../middleware/auth.js";
const userRouter = Router()


userRouter.post("/addProfilePicture", auth()
    , fileUpload(fileValidation.image).single('image'),
    userController.addProfilePicture)

    
userRouter.post("/addCoverPictures", auth()
, fileUpload(fileValidation.image).single('image'),
userController.addCoverPictures)


userRouter.patch('/updatePassword',auth(),userController.updatePassword)
userRouter.patch('/softDelete',auth(),userController.softDelete)

export default userRouter