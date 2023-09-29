import slugify from "slugify"
import userModel from "../../../../DB/models/user.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import { StatusCodes } from "http-status-codes";
import { compare, hash } from "../../../utils/hashing.js";
import { ErrorClass } from "../../../utils/errorClass.js";






//*Add Profile Picture 
export const addProfilePicture = asyncHandler(async(req,res,next)=>{
    const id = req.user._id
    const user = await userModel.findById(id)
    const slug = slugify(user.name)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Social/User/${slug}/ProfilePicture` })
    const updateUser = await userModel.updateOne({_id:id},{
        profilePicture:{ secure_url, public_id }
    })
    return res.status(StatusCodes.OK).json({ message: "Done" })
})

//*Add Cover Picture 
export const addCoverPictures = asyncHandler(async(req,res,next)=>{
    const id = req.user._id
    const user = await userModel.findById(id)
    const slug = slugify(user.name)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Social/User/${slug}/CoverPictures` })
    const coverPictures=[]

    coverPictures.push({ secure_url, public_id })
    await userModel.updateOne({_id:id},
        { 
            $push: { coverPictures: coverPictures } 
        },
    )
    console.log(user);
    return res.status(StatusCodes.OK).json({ message: "Done"})
})


//*soft delete(user must be logged in){ where data is not permanently removed from a database when it is deleted but is instead marked as deleted}
export const softDelete = asyncHandler(async (req, res, next) => {
    await userModel.updateOne({ _id: req.user._id }, { isDeleted: true });
    return res.status(StatusCodes.OK).json({ message: "Done" })
})




//*UPDATE Password
export const updatePassword =asyncHandler(async(req,res,next)=>{
    const {password , cPassword} = req.body
    const id =req.user._id

    if (password != cPassword) {
        return next(new ErrorClass(`Please check your cPassword`, StatusCodes.CONFLICT))
    }
    const match = compare(password, req.user.password)
    if (match) {
        return next(new ErrorClass(` new password must be different from old password`, StatusCodes.NOT_ACCEPTABLE))
    }
    const hashPassword = hash(password)
    await userModel.updateOne({_id:id},{password:hashPassword})
    return res.status(StatusCodes.OK).json({ message: "Done" })

})