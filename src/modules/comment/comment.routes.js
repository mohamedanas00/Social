import { Router } from "express";
import * as commentController from './controller/comment.js'
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as validator from './comment.validation.js'

const commentRouter =Router()


commentRouter.route('/:id')
    .post(auth(),validation(validator.addComment),commentController.addComment)
    .patch(auth(),validation(validator.updateComment),commentController.updateComment)
    .delete(auth(),validation(validator.deleteComment),commentController.deleteComment)

commentRouter.patch('/like/:id',auth(),validation(validator.likeComment),commentController.likeComment)
commentRouter.delete('/unlike/:id',auth(),validation(validator.unlikeComment),commentController.unlikeComment)


export default commentRouter