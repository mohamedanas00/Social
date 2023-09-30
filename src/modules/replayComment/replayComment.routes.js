import { Router } from "express";
import * as commentController from './controller/replayComment.js'
import auth from "../../middleware/auth.js";
import * as validator from './\/replayComment.validation.js'
import { validation } from "../../middleware/validation.js";
const replyCommentRouter = Router()

replyCommentRouter.route('/:id')
    .post(auth(), validation(validator.addReplyComment), commentController.addReplyComment)
    .patch(auth(), validation(validator.updateReplyComment), commentController.updateReplyComment)
    .delete(auth(), validation(validator.deleteReplyComment), commentController.deleteReplyComment)


replyCommentRouter.patch('/like/:id', auth(), validation(validator.likeReplyComment), commentController.likeReplyComment)
replyCommentRouter.patch('/unlike/:id',auth(), validation(validator.unlikeReplyComment), commentController.unlikeComment)
export default replyCommentRouter