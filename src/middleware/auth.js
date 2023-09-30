import { StatusCodes } from "http-status-codes";
import { ErrorClass } from "../utils/errorClass.js";
import { asyncHandler } from "../utils/errorHandling.js";
import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";
import { generateRefreshToken } from "../utils/generateAndVerfiyToken.js";


const auth = () => {
    return asyncHandler(async (req, res, next) => {
        const { authenticated } = req.headers;
        if (!authenticated?.startsWith(process.env.BEARER_KEY)) {
            return next(new ErrorClass("In-valid bearer-key", StatusCodes.BAD_REQUEST))
        }

        const token = authenticated.split(process.env.BEARER_KEY)[1]
        try {
            console.log(token);
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
        } catch (error) {
            if (error == "TokenExpiredError: jwt expired") {
                //!If userToken is Expire Send new RefreshToken that Expire in 6 month
                const isExist = await userModel.findOne({ token: token })
                if (!isExist) {
                    return next(new ErrorClass("In-valid token", StatusCodes.BAD_REQUEST))
                }
                const payload = {
                    id: isExist._id,
                    email: isExist.email
                }
                const refreshtoken = generateRefreshToken(payload)
                isExist.token = refreshtoken
                await isExist.save()
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Your token is Expire use Refresh", RefreshToken: refreshtoken })
            }
            return next(new ErrorClass("In-valid token", StatusCodes.BAD_REQUEST)) 
        }
    })
}
export default auth