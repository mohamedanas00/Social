import postModel from "../../../../DB/models/post.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { StatusCodes } from "http-status-codes";
import slugify from "slugify"
import { ApiFeatures } from "../../../utils/apiFeature.js";

//*Add post (body or video or photo )
//*Or add 3 together in one post
//!Not that you can add 5 photos  and 1 video
export const addPost = asyncHandler(async (req, res, next) => {
    const userId = req.user._id
    const slug = slugify(req.user.name)
    if (req.files.images) {
        const images = []
        for (let i = 0; i < req.files.images.length; i++) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(req.files.images[i].path, { folder: `Social/posts/${slug}/postsImages` })
            images.push({ secure_url, public_id })
        }
        req.body.images = images
    }
    if (req.files.video) {
        const vidoSize = req.files.video[0].size
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
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.video[0].path, uploadOptions)
        req.body.video = { secure_url, public_id }
    }
    req.body.createdBy = userId
    const post = await postModel.create(req.body)
    res.status(StatusCodes.CREATED).json({ message: "Done", post })
})

//*Update post (body or video or photo )
//*Or add 3 together in one post
export const updatePost = asyncHandler(async (req, res, next) => {
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

    if (req.files.images) {
        if (post.images.length > 0) {
            for (const image of post.images) {
                console.log(image.public_id);
                await cloudinary.uploader.destroy(image.public_id)
            }
        }
        const images = []
        for (let i = 0; i < req.files.images.length; i++) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(req.files.images[i].path, { folder: `Social/posts/${slug}/postsImages` })
            images.push({ secure_url, public_id })
        }
        req.body.images = images
    }

    if (req.files.video) {
        if (post.video) {
            console.log(post.video.public_id);
            await cloudinary.uploader.destroy(post.video.public_id)
        }
        const vidoSize = req.files.video[0].size
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
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.video[0].path, uploadOptions)
        req.body.video = { secure_url, public_id }
    }
    const newPost = await postModel.findByIdAndUpdate(id, {
        content: req.body.content,
        images: req.body.images,
        video: req.body.video,
    }, {
        new: true,
    })
    res.status(StatusCodes.OK).json({ message: "Done", newPost })

})

//*The Owner Of The Post can Only change Privacy
export const updatePostPrivacy = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userId = req.user._id
    const { privacy } = req.body
    const post = await postModel.findById(id)

    if (!post) {
        return next(new ErrorClass(`Post Not Exist`), StatusCodes.NOT_FOUND)
    }

    if (post.isDeleted) {
        return next(new ErrorClass(`Post is soft Deleted`), StatusCodes.NOT_FOUND)
    }

    if (post.createdBy.toString() != userId.toString()) {
        return next(new ErrorClass(`You do not have permission to do this`), StatusCodes.UNAUTHORIZED)
    }

    post.privacy = privacy,

        await post.save()
    res.status(StatusCodes.OK).json({ message: "Done" })

})

//*Delete post (photos-videos-comment- reply comment)
//!Note that I use  hooks to delete => comment - reply comment
export const deletePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userId = req.user._id

    const post = await postModel.findById(id)

    if (!post) {
        return next(new ErrorClass(`Post Not Exist`), StatusCodes.NOT_FOUND)
    }


    if (post.isDeleted) {
        return next(new ErrorClass(`Post is Already Deleted by soft Delete`), StatusCodes.NOT_FOUND)
    }

    if (post.createdBy.toString() != userId.toString()) {
        return next(new ErrorClass(`You do not have permission to do this`), StatusCodes.UNAUTHORIZED)
    }

    if (post.images.length > 0) {
        for (const image of post.images) {
            console.log(image.public_id);
            await cloudinary.uploader.destroy(image.public_id)
        }
    }

    if (post.video) {
        console.log(post.video.public_id);
        await cloudinary.uploader.destroy(post.video.public_id)
    }

    await postModel.deleteOne({ _id: id })
    res.status(StatusCodes.OK).json({ message: "Done" })

})

//*Get post with it is comments by send Id 
//!if post privacy is  'only' own user only can get it
export const getPostById = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userId = req.user._id

    const post = await postModel.findById(id).populate([{
        path: 'Comments',
        select: 'commentBody replies likes'
    }])

    if (!post) {
        return next(new ErrorClass(`Post Not Exist`), StatusCodes.NOT_FOUND)
    }

    if (post.isDeleted) {
        return next(new ErrorClass(`Post is  Deleted by soft Delete`), StatusCodes.NOT_FOUND)
    }

    if (post.privacy == 'only' && post.createdBy.toString() != userId.toString()) {
        return next(new ErrorClass(`You do not have permission to show this post`), StatusCodes.UNAUTHORIZED)
    }

    res.status(StatusCodes.OK).json({ message: "Done", post })

})

//*Get all posts with it is comments by send Id 
//*IF any post have privacy 'only' the owner user only can this =>
//*posts represent to him
//*Using ApiFeatures
export const getAllPosts = asyncHandler(async (req, res, next) => {
    const userId = req.user._id
    if (req.user.isDeleted) {
        return next(new ErrorClass(`You can’t get posts`), StatusCodes.UNAUTHORIZED)
    }

    let apiFeatures = new ApiFeatures(postModel.find(), req.query).pagination(postModel).filter().search().sort()
    let posts = await apiFeatures.mongooseQuery
        .populate([{
            path: 'Comments',
            select: 'commentBody replies likes'
        }])

    const postsArray = []
    for (const post of posts) {
        if (post.privacy == 'only' && post.createdBy.toString() != userId.toString()) {
            continue
        }
        postsArray.push(post)

    }
    res.status(StatusCodes.OK).json({
        Current_Page: apiFeatures.page,
        Next_Page: apiFeatures.next,
        Previous_Page: apiFeatures.previous,
        Total_Pages: apiFeatures.totalPages,
        Posts_Count: apiFeatures.countDocuments,
        postsArray
    })

})

//*Get all posts with it is comments by send Id that created today
//!Check if post create today or not 
export const getPostsCreatedToDay = asyncHandler(async (req, res, next) => {
    const userId = req.user._id
    if (req.user.isDeleted) {
        return next(new ErrorClass(`You can’t get posts`), StatusCodes.UNAUTHORIZED)
    }

    const postsArray = []
    const currentDate = new Date();
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    //!get all posts and Check if create today or not  
    let apiFeatures = new ApiFeatures(postModel.find({  createdAt: { $gte: startOfDay, $lte: endOfDay,},}),
     req.query).pagination(postModel).filter().search().sort()
    let posts = await apiFeatures.mongooseQuery
        .populate([{
            path: 'Comments',
            select: 'commentBody replies likes'
    }])


    for (const post of posts) {
        if (post.privacy == 'only' && post.createdBy.toString() != userId.toString()) {
            continue
        }
        postsArray.push(post)
    }
    res.status(StatusCodes.OK).json({
        Current_Page: apiFeatures.page,
        Next_Page: apiFeatures.next,
        Previous_Page: apiFeatures.previous,
        Total_Pages: apiFeatures.totalPages,
        Posts_Count: postsArray.length,
        postsArray
    })
})


//*Get all posts with it is comments by send Id that created today
//!Check if post create today or not 
export const getPostsCreatedYesterDay = asyncHandler(async (req, res, next) => {
    const userId = req.user._id
    if (req.user.isDeleted) {
        return next(new ErrorClass(`You can’t get posts`), StatusCodes.UNAUTHORIZED)
    }

    let apiFeatures = new ApiFeatures(postModel.find(), req.query).pagination(postModel).filter().search().sort()
    let posts = await apiFeatures.mongooseQuery
        .populate([{
            path: 'Comments',
            select: 'commentBody replies likes'
        }])

    const postsArray = []
    //*Calculate the start and end timestamps for yesterday
    const currentDate = new Date();
    const startOfYesterday = new Date(currentDate);
    startOfYesterday.setDate(currentDate.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);

    const endOfYesterday = new Date(currentDate);
    endOfYesterday.setDate(currentDate.getDate() - 1);
    endOfYesterday.setHours(23, 59, 59, 999);
        console.log(startOfYesterday);
        console.log(endOfYesterday);

    for (const post of posts) {
        if (post.privacy == 'only' && post.createdBy.toString() != userId.toString()) {
            continue
        }
        //!Check if create today or not
        console.log(post.createdAt); 
        if (startOfYesterday < post.createdAt && post.createdAt <= endOfYesterday) {
            postsArray.push(post)
        }
    }
    res.status(StatusCodes.OK).json({
        Current_Page: apiFeatures.page,
        Next_Page: apiFeatures.next,
        Previous_Page: apiFeatures.previous,
        Total_Pages: apiFeatures.totalPages,
        Posts_Count: postsArray.length,
        postsArray
    })
}) 


//*like post
//*Check post is Exist and user can like the comment only one time 
//*if post is only , owner only can like post
export const likePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userID = req.user._id

    const post = await postModel.findById(id)
    if (!post) {
        return next(new ErrorClass("post is Not Exist!", StatusCodes.NOT_FOUND))
    }

    if (post.isDeleted) {
        return next(new ErrorClass("post is soft deleted!", StatusCodes.NOT_FOUND))
    }

    if (post.privacy == 'only' && post.createdBy.toString() != userID.toString()) {
        return next(new ErrorClass("You Can not like this post!", StatusCodes.CONFLICT))
    }

    for (const user of post.likes) {
        if (user.userId.toString() == userID.toString()) {
            return next(new ErrorClass("You Already Liked This post!", StatusCodes.CONFLICT))

        }
    }


    await postModel.updateOne({ _id: id }, {
        $push: {
            likes: { userId: userID },
        }
    })

    return res.status(StatusCodes.OK).json({ message: "Done" })
})


//*Unlike Post
//*Check Post is Exist and  sure that user like the Post before to make unlike
//*if post is only , owner only can unlike post
export const unlikePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userID = req.user._id

    const post = await postModel.findById(id)
    if (!post) {
        return next(new ErrorClass("post is Not Exist!", StatusCodes.NOT_FOUND))
    }

    if (post.isDeleted) {
        return next(new ErrorClass("post is soft deleted!", StatusCodes.NOT_FOUND))
    }

    if (post.privacy == 'only' && post.createdBy.toString() != userID.toString()) {
        return next(new ErrorClass("You Can not unlike this post!", StatusCodes.CONFLICT))
    }

    let isExist = false
    for (const user of post.likes) {
        if (user.userId.toString() == userID.toString()) {
            isExist = true
            break;
        }
    }

    if (!isExist) {
        return next(new ErrorClass("You already unlike this post!", StatusCodes.NOT_FOUND))
    }

    await postModel.updateOne({ _id: id }, {
        $pull: {
            likes: { userId: userID },
        }
    })

    return res.status(StatusCodes.OK).json({ message: "Done" })
})