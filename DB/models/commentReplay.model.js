import { Schema, model } from "mongoose";

const replySchema = new Schema({
    replyBody:{type:String, minlength:1,maxlength:200,required:true},
    createdBy:{type: Schema.Types.ObjectId, ref: 'User',  required: true},
    commentId:{type: Schema.Types.ObjectId, ref: 'Comment',  required: true},
    postId:{type: Schema.Types.ObjectId, ref: 'Post',  required: true},
    likes:[{  userId: {  type: Schema.Types.ObjectId, ref: 'User'},}],
},
    {
        timestamps: true,
    }
)




const replyCommentModel = model('Reply', replySchema)

export default replyCommentModel