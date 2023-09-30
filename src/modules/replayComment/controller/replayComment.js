import { StatusCodes } from "http-status-codes"
import commentModel from "../../../../DB/models/comment.model.js"
import postModel from "../../../../DB/models/post.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import replyCommentModel from "../../../../DB/models/commentReplay.model.js"




//*Add Reply Comment to specific comment in post 
//*Check post is not Deleted 
//*Check Post is public to have permission to make comment
//*Check user is notDeleted
export const addReplyComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const createdBy = req.user._id
    const { replyBody } = req.body
    const comment = await commentModel.findById(id)

    if (!comment) {
        return next(new ErrorClass("comment is Not Exist!", StatusCodes.NOT_FOUND))
    }
    const post = await postModel.findById(comment.PostId)

    if(!post){
        return next(new ErrorClass("post is Not Exist!", StatusCodes.NOT_FOUND))
    }
    if(post.isDeleted){
        return next(new ErrorClass("Post is Deleted!", StatusCodes.NOT_FOUND))
    }
    if (post.privacy == 'only') {
        return next(new ErrorClass("You Do not have permission to make reply Comment in this post!", StatusCodes.UNAUTHORIZED))
    }

    if (req.user.isDeleted) {
        return next(new ErrorClass("You can’t add replyComment", StatusCodes.UNAUTHORIZED))
    }
    const replyComment = await replyCommentModel.create({
        replyBody,
        commentId: id,
        createdBy,
        postId:comment.PostId
    })
    await comment.updateOne({ _id: id }, {
        $push: {
            replies: replyComment._id
        }
    })
    return res.status(StatusCodes.CREATED).json({ message: "Done", replyComment })
})

//*update ReplyComment Body
//*Check ReplyComment is Exist and comment by owner only
//*add the post not deleted
export const updateReplyComment = asyncHandler(async(req,res,next)=>{
    const { id } = req.params
    const userID = req.user._id
    const { replyBody } = req.body
    const replyComment = await replyCommentModel.findById(id)

    if (!replyComment) {
        return next(new ErrorClass("Reply comment is Not Exist!", StatusCodes.NOT_FOUND))
    }
    const post = await postModel.findById(replyComment.postId)

    if(!post){
        return next(new ErrorClass("post is Not Exist!", StatusCodes.NOT_FOUND))
    }
    if(post.isDeleted){
        return next(new ErrorClass("Post is Deleted!", StatusCodes.NOT_FOUND))
    }

    if (replyComment.createdBy.toString() != userID.toString()) {
        return next(new ErrorClass("You Do not have permission to make comment in this post!", StatusCodes.UNAUTHORIZED))
    }

    replyComment.replyBody = replyBody

    await replyComment.save()


    return res.status(StatusCodes.OK).json({ message: "Done", replyComment })
}) 


//*delete Reply Comment 
//*Check Reply Comment is Exist and deleted by owner only
export const deleteReplyComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userID = req.user._id

    const replyComment = await replyCommentModel.findById(id)
    if (!replyComment) {
        return next(new ErrorClass("Reply Comment is Not Exist!", StatusCodes.NOT_FOUND))
    }

    if (replyComment.createdBy.toString() != userID.toString()) {
        return next(new ErrorClass("You Do not have permission to make Reply Comment in this post!", StatusCodes.UNAUTHORIZED))
    }

    await replyCommentModel.deleteOne({ _id: id })
    return res.status(StatusCodes.OK).json({ message: "Done" })
})

//*like Reply Comment
//*Check Reply Comment is Exist and user can like the comment only one time
export const likeReplyComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userID = req.user._id

    const replyComment = await replyCommentModel.findById(id)
    if (!replyComment) {
        return next(new ErrorClass("Reply Comment is Not Exist!", StatusCodes.NOT_FOUND))
    }

    for (const user of replyComment.likes) {
        if (user.userId.toString() == userID.toString()) {
            return next(new ErrorClass("You Already Liked This Reply Comment!", StatusCodes.CONFLICT))

        }
    }

    await replyCommentModel.updateOne({ _id: id }, {
        $push: {
            likes: { userId: userID },
        }
    })

    return res.status(StatusCodes.OK).json({ message: "Done" })
})


//*Unlike  Reply Comment
//*Check  Reply Comment is Exist and  sure that user like the  Reply Comment before to make unlike
//*if not he can not make unlike
export const unlikeComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userID = req.user._id

    const replyComment = await replyCommentModel.findById(id)
    if (!replyComment) {
        return next(new ErrorClass("reply Comment is Not Exist!", StatusCodes.NOT_FOUND))
    }
    let isExist = false
    for (const user of replyComment.likes) {
        if (user.userId.toString() == userID.toString()) {
            isExist = true
            break;
        }
    }

    if (!isExist) {
        return next(new ErrorClass("You already unlike this Reply Comment!", StatusCodes.NOT_FOUND))
    }

    await replyCommentModel.updateOne({ _id: id }, {
        $pull: {
            likes: { userId: userID },
        }
    })

    return res.status(StatusCodes.OK).json({ message: "Done" })
})


