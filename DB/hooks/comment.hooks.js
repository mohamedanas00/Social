import replyCommentModel from "../models/commentReplay.model.js"



export const deleteOne_CommentH= (Schema)=>{
    Schema.post('deleteOne', { document: false, query: true } ,async function () {
        await replyCommentModel.deleteMany({
            commentId: this.getQuery()._id
        })
    })
}
