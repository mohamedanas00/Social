import { Router } from "express";
import * as commentController from './controller/replayComment.js'
import auth from "../../middleware/auth.js";

const replyCommentRouter =Router()

replyCommentRouter.route('/:id')
    .post(auth(),commentController.addReplyComment)
    .patch(auth(),commentController.updateReplyComment)
    .delete(auth(),commentController.deleteReplyComment)


export default replyCommentRouter