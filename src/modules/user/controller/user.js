import slugify from "slugify"
import userModel from "../../../../DB/models/user.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import { StatusCodes } from "http-status-codes";
import { compare, hash } from "../../../utils/hashing.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import CryptoJS from "crypto-js";
import { nanoid } from "nanoid";
import { emailHtml, sendEmail } from "../../../utils/email.js";
import postModel from "../../../../DB/models/post.model.js";





//*Add Profile Picture 
export const addProfilePicture = asyncHandler(async (req, res, next) => {
    const id = req.user._id
    const user = await userModel.findById(id)
    const slug = slugify(user.name)
    //*Delete previous  profilePicture from cloudinary
    if (user.profilePicture) {
        await cloudinary.uploader.destroy(user.profilePicture.public_id)
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Social/User/${slug}/ProfilePicture` })
    const updateUser = await userModel.updateOne({ _id: id }, {
        profilePicture: { secure_url, public_id }
    })
    return res.status(StatusCodes.OK).json({ message: "Done" })
})

//*Add Cover Picture 
export const addCoverPictures = asyncHandler(async (req, res, next) => {
    const id = req.user._id
    const user = await userModel.findById(id)
    const slug = slugify(user.name)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Social/User/${slug}/CoverPictures` })
    const coverPictures = []

    coverPictures.push({ secure_url, public_id })
    await userModel.updateOne({ _id: id },
        {
            $push: { coverPictures: coverPictures }
        },
    )
    console.log(user);
    return res.status(StatusCodes.OK).json({ message: "Done" })
})


//*soft delete(user must be logged in)
//*{ where data is not permanently removed from a database when it is deleted but is instead marked as deleted}
export const softDelete = asyncHandler(async (req, res, next) => {
    console.log("7mbozo akl bozo");
    const id = req.user._id
    await userModel.updateOne({ _id: id }, { isDeleted: true });
    return res.status(StatusCodes.OK).json({ message: "Done" })
})




//*UPDATE Password
export const updatePassword = asyncHandler(async (req, res, next) => {
    const { password, cPassword } = req.body
    const id = req.user._id

    if (password != cPassword) {
        return next(new ErrorClass(`Please check your cPassword`, StatusCodes.CONFLICT))
    }
    const match = compare(password, req.user.password)
    if (match) {
        return next(new ErrorClass(` new password must be different from old password`, StatusCodes.NOT_ACCEPTABLE))
    }
    const hashPassword = hash(password)
    await userModel.updateOne({ _id: id }, { password: hashPassword })
    return res.status(StatusCodes.OK).json({ message: "Done" })

})

//*User Profile:Get all user Data(expected -password -confirmEmail -confirmCode) 
export const getUserProfile = asyncHandler(async (req, res, next) => {
    if (req.user.phone) {
        req.user.phone = CryptoJS.AES.decrypt(req.user.phone, process.env.encrypt_key).toString(CryptoJS.enc.Utf8);
    }
    return res.status(StatusCodes.OK).json({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        age: req.user.age,
        profilePicture: req.user.profilePicture,
        coverPictures: req.user.coverPictures
    })
})


//*Update user Profile:Update{ name ,email, phone, age } 
export const updateProfile = asyncHandler(async (req, res, next) => {
    const userID = req.user._id
    let { firstName, lastName, email, phone, age } = req.body
    let messageEmail = ''
    if (email) {
        const isEmailExist = await userModel.findOne({ email: req.body.email })
        if (isEmailExist) {
            return next(new ErrorClass(`This email:"${req.body.email}" Already Exist!`, StatusCodes.CONFLICT))
        }
        const code = nanoid(4)
        const html = emailHtml(code)
        sendEmail({ to: email, subject: "Confirm Email", html })
        await userModel.findByIdAndUpdate(userID, {
            email,
            confirmEmail: false,
            confirmCode: code,
        })
        messageEmail = `Please Confirm your NewEmail by code send in your mail ${code}`
    }
    if (phone) {
        phone = CryptoJS.AES.encrypt(phone, process.env.encrypt_key).toString()
    }
    await userModel.findOneAndUpdate({ _id: userID }, {
        firstName,
        lastName,
        name: firstName + ' ' + lastName,
        phone,
        age
    })
    return res.status(StatusCodes.OK).json({ message: "Done", NoteThat: messageEmail })
})

//*User add video for his posts 
export const addVideoForPost = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userId = req.user._id
    const slug = slugify(req.user.name)

    const post = await postModel.findById(id)

    if (!post) {
        return next(new ErrorClass(`Post Not Exist`), StatusCodes.NOT_FOUND)
    }

    if (post.isDeleted) {
        return next(new ErrorClass(`Post is Deleted`), StatusCodes.NOT_FOUND)
    }

    if (post.createdBy.toString() != userId.toString()) {
        return next(new ErrorClass(`You do not have permission to do this`), StatusCodes.UNAUTHORIZED)
    }
    const vidoSize = req.file.path.size
    const MB = vidoSize / (1024 * 1024)
    if (MB > 50) {
        return next(new ErrorClass(`This Video is very large,The Max Size Of Video is 50MB`), StatusCodes.NOT_ACCEPTABLE)
    }
    const uploadOptions = {
        resource_type: "video",
        folder: `Social/posts/${slug}/postsVideos`,
        //* the maximum file size
        max_file_size: 50 * 1024 * 1024, // 50 MB

        //* the maximum duration 
        max_video_duration: 60, // 60 seconds

        //* frame rate for the video
        max_allowed_frame_rate: 30, // 30 frames per second
    };
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, uploadOptions)
    req.body.video = { secure_url, public_id }

    const newPost = await postModel.findByIdAndUpdate(id, {
        video: req.body.video,
    }, {
        new: true,
    })
    res.status(StatusCodes.OK).json({ message: "Done", newPost })

})
