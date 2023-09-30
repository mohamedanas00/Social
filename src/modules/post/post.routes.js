import { Router } from "express";
import * as postController from './controller/post.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from "../../middleware/auth.js";


const postRouter = Router()

postRouter.route('/')
    .post(auth(),
        fileUpload(fileValidation.media).fields([
            { name: 'video', maxCount: 1 },
            { name: 'images', maxCount: 5 }

        ]),
        postController.addPost)
    .get(auth(), postController.getAllPosts)

postRouter.get('/postCreatedToday',auth() ,postController.getPostsCreatedToDay)
postRouter.get('/postCreatedYesterday',auth() ,postController.getPostsCreatedYesterDay)
postRouter.patch('/likePost/:id',auth() ,postController.likePost)
postRouter.delete('/unlikePost/:id',auth(),postController.unlikePost)

postRouter.route('/:id')
    .put(auth(), fileUpload(fileValidation.media).fields([
        { name: 'video', maxCount: 1 },
        { name: 'images', maxCount: 5 }

    ]), postController.updatePost)
    .delete(auth(), postController.deletePost)
    .get(auth(), postController.getPostById)
    .patch(auth(), postController.updatePostPrivacy)





export default postRouter