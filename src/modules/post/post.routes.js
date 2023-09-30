import { Router } from "express";
import * as postController from './controller/post.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as validator from './post.validation.js'
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";


const postRouter = Router()

postRouter.route('/')
    .post(auth(),
        fileUpload(fileValidation.media).fields([
            { name: 'video', maxCount: 1 },
            { name: 'images', maxCount: 5 }

        ]),validation(validator.addPost)
        ,postController.addPost)
    .get(auth(),validation(validator.getValidation) ,postController.getAllPosts)

postRouter.get('/postCreatedToday',auth(),validation(validator.getValidation) ,postController.getPostsCreatedToDay)
postRouter.get('/postCreatedYesterday',auth(),validation(validator.getValidation) ,postController.getPostsCreatedYesterDay)
postRouter.patch('/likePost/:id',auth(),validation(validator.idPatchLikes) ,postController.likePost)
postRouter.delete('/unlikePost/:id',validation(validator.idPatchLikes),auth(),postController.unlikePost)

postRouter.route('/:id')
    .put(auth(), fileUpload(fileValidation.media).fields([
        { name: 'video', maxCount: 1 },
        { name: 'images', maxCount: 5 }

    ]), postController.updatePost)
    .delete(auth(),validation(validator.deletePost),postController.deletePost)
    .get(auth(),validation(validator.getPostById) ,postController.getPostById)
    .patch(auth(),validation(validator.updatePostPrivacy) ,postController.updatePostPrivacy)





export default postRouter