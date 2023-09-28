import userModel from "../../../../DB/models/user.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { StatusCodes } from "http-status-codes";
import CryptoJS from "crypto-js";
import { compare, hash } from "../../../utils/hashing.js";
import { nanoid } from "nanoid";
import { emailHtml, sendEmail } from "../../../utils/email.js";
import { generateToken, generateRefreshToken } from './../../../utils/generateAndVerfiyToken.js'



//*SignUp:{TakeUserData - Hash user password#️⃣ - encrypt user phone📲 - send confirmation email📨}
export const signUp = asyncHandler(async (req, res, next) => {
    let { name, email, password, cPassword, phone, age } = req.body
    const isEmailExist = await userModel.findOne({ email: email })

    if (isEmailExist) {
        return next(new ErrorClass(`This email:"${email}" Already Exist!`, StatusCodes.CONFLICT))
    }
    if (phone) {
        phone = CryptoJS.AES.encrypt(phone, process.env.encrypt_key).toString()
    }
    if (password != cPassword) {
        return next(new ErrorClass(`Please check your cPassword`, StatusCodes.CONFLICT))
    }

    const hashPassword = hash(password)
    const code = nanoid(4)
    const confirmCode = code
    const html = emailHtml(code)
    sendEmail({ to: email, subject: "Confirm Email", html })
    const user = new userModel({
        name,
        email,
        password: hashPassword,
        phone,
        age,
        confirmCode,
    })
    await user.save()
    return res.status(StatusCodes.CREATED).json({ message: "Done", user })
})

//*ConfirmEmail: To confirm your email by code that send in Mail📧 to get access to sigIn
export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { email, code } = req.body
    const isEmailExist = await userModel.findOne({ email })
    if (!isEmailExist) {
        return next(new ErrorClass(`This email:"${email}" Not Found!`, StatusCodes.NOT_FOUND))
    }
    if (isEmailExist.confirmEmail) {
        return next(new ErrorClass(`Email Already Confirmed!`, StatusCodes.NOT_ACCEPTABLE))
    }
    if (code != isEmailExist.confirmCode) {
        return next(new ErrorClass(`In-Valid code`, StatusCodes.BAD_REQUEST))
    }
    const newCode = nanoid(4)
    await userModel.updateOne({ email }, { confirmEmail: true, confirmCode: newCode })
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done" })
})

//*LogIn🔓:After ConfirmEmail make login and return {accessToken && RefreshToken}
export const logIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const isExist = await userModel.findOne({ email })
    if (!isExist) {
        return next(new ErrorClass(`In-valid user Information`, StatusCodes.NOT_ACCEPTABLE))
    }
    if (isExist.confirmEmail == false) {
        return next(new ErrorClass(`NON_AUTHORITATIVE`, StatusCodes.NON_AUTHORITATIVE_INFORMATION))
    }

    const match = compare(password, isExist.password)
    if (!match) {
        return next(new ErrorClass(`In-valid user Information`, StatusCodes.NOT_ACCEPTABLE))
    }
    const payload = {
        id: isExist._id,
        email: isExist.email
    }
    //*Generate Token:to expire in 5min && RefreshToken expire in 6 months
    const token = generateToken(payload)
    const RefreshToken=generateToken(payload)
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done",accessToken:token,RefreshToken:RefreshToken })
})





