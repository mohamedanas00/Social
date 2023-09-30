import commentModel from "../models/comment.model.js"
import replyCommentModel from "../models/commentReplay.model.js"



export const deleteOne_PostH= (Schema)=>{
    Schema.post('deleteOne', { document: false, query: true } ,async function () {
        await commentModel.deleteMany({
            PostId: this.getQuery()._id
        })
        await replyCommentModel.deleteMany({
            postId: this.getQuery()._id
        })
    })
}