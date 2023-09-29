import { StatusCodes } from "http-status-codes";
import userModel from "../../../../DB/models/user.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import commentModel from "../../../../DB/models/comment.model.js";
import postModel from "../../../../DB/models/post.model.js";




//*Add Comment to specific post 
//*Check post is not Deleted && and not delete in soft delete
//*Check Post is public to have permission to make comment
//*Check user is notDeleted
export const addComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const createdBy = req.user._id
    const { commentBody } = req.body
    const post = await postModel.findById(id)

    if (!post) {
        return next(new ErrorClass("Post is Not Exist!", StatusCodes.NOT_FOUND))
    }
    if(post.isDeleted){
        return next(new ErrorClass("Post is Deleted!", StatusCodes.NOT_FOUND))
    }
    if (post.privacy == 'only') {
        return next(new ErrorClass("You Do not have permission to make comment in this post!", StatusCodes.UNAUTHORIZED))
    }

    if (req.user.isDeleted) {
        return next(new ErrorClass("You can’t add comment", StatusCodes.UNAUTHORIZED))
    }

    const comment = await commentModel.create({
        commentBody,
        PostId: id,
        createdBy
    })
    await postModel.updateOne({ _id: id }, {
        $push: {
            comments: comment._id
        }
    })
    return res.status(StatusCodes.CREATED).json({ message: "Done", comment })
})

//*update Comment Body
//*Check comment is Exist and comment by owner only
export const updateComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userID = req.user._id
    const { commentBody } = req.body

    const comment = await commentModel.findById(id)
    if (!comment) {
        return next(new ErrorClass("Comment is Not Exist!", StatusCodes.NOT_FOUND))
    }

    if (comment.createdBy.toString() != userID.toString()) {
        return next(new ErrorClass("You Do not have permission to make comment in this post!", StatusCodes.UNAUTHORIZED))
    }

    comment.commentBody = commentBody

    await comment.save()


    return res.status(StatusCodes.OK).json({ message: "Done", comment })

})

//*delete Comment 
//*Check comment is Exist and deleted by owner only
export const deleteComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userID = req.user._id

    const comment = await commentModel.findById(id)
    if (!comment) {
        return next(new ErrorClass("Comment is Not Exist!", StatusCodes.NOT_FOUND))
    }

    if (comment.createdBy.toString() != userID.toString()) {
        return next(new ErrorClass("You Do not have permission to make comment in this post!", StatusCodes.UNAUTHORIZED))
    }

    await commentModel.deleteOne({ _id: id })
    return res.status(StatusCodes.OK).json({ message: "Done" })
})

//*like comment
//*Check comment is Exist and user can like the comment only one time
export const likeComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userID = req.user._id

    const comment = await commentModel.findById(id)
    if (!comment) {
        return next(new ErrorClass("Comment is Not Exist!", StatusCodes.NOT_FOUND))
    }

    for (const user of comment.likes) {
        if (user.userId.toString() == userID.toString()) {
            return next(new ErrorClass("You Already Liked This Comment!", StatusCodes.CONFLICT))

        }
    }

    await commentModel.updateOne({ _id: id }, {
        $push: {
            likes: { userId: userID },
        }
    })

    return res.status(StatusCodes.OK).json({ message: "Done" })
})


//*Unlike comment
//*Check comment is Exist and  sure that user like the comment before to make unlike
//*if not he can not make unlike
export const unlikeComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userID = req.user._id

    const comment = await commentModel.findById(id)
    if (!comment) {
        return next(new ErrorClass("Comment is Not Exist!", StatusCodes.NOT_FOUND))
    }
    let isExist = false
    for (const user of comment.likes) {
        if (user.userId.toString() == userID.toString()) {
            isExist = true
            break;
        }
    }

    if (!isExist) {
        return next(new ErrorClass("You already unlike this Comment!", StatusCodes.NOT_FOUND))
    }

    await commentModel.updateOne({ _id: id }, {
        $pull: {
            likes: { userId: userID },
        }
    })

    return res.status(StatusCodes.OK).json({ message: "Done" })
})





