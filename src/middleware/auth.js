import { StatusCodes } from "http-status-codes";
import { ErrorClass } from "../utils/errorClass.js";
import { asyncHandler } from "../utils/errorHandling.js";
import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";


const auth = () => {
    return asyncHandler(async (req, res, next) => {
        const { authenticated } = req.headers;
        if (!authenticated?.startsWith(process.env.BEARER_KEY)) {
            return next(new ErrorClass("In-valid bearer-key", StatusCodes.BAD_REQUEST))
        }
        const token = authenticated.split(process.env.BEARER_KEY)[1]
        if (!token) {
            return next(new ErrorClass("In-valid token", StatusCodes.BAD_REQUEST))
        }
        const decode = jwt.verify(token, process.env.TOKEN_SIGNATURE)
        if (!decode?.id) {
            return next(new ErrorClass("In-valid token payload", StatusCodes.BAD_REQUEST))
        }
        const authUser = await userModel.findOne({ _id: decode.id })
        if (!authUser) {
            return next(new ErrorClass("Not Register account", StatusCodes.NOT_FOUND))
        }
        req.user = authUser
        return next()
    })
}
export default auth