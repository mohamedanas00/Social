import { Router } from "express";
import * as commentController from './controller/comment.js'
import auth from "../../middleware/auth.js";


const commentRouter =Router()


commentRouter.route('/:id')
    .post(auth(),commentController.addComment)
    .patch(auth(),commentController.updateComment)
    .delete(auth(),commentController.deleteComment)

commentRouter.patch('/like/:id',auth(),commentController.likeComment)
commentRouter.delete('/unlike/:id',auth(),commentController.unlikeComment)


export default commentRouter