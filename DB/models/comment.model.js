import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    commentBody:{type:String, minlength:1,maxlength:300,required:true},
    createdBy:{type: Schema.Types.ObjectId, ref: 'User',  required: true},
    PostId:{type: Schema.Types.ObjectId, ref: 'Post',  required: true},
    replies:[{ replyId: {  type: Schema.Types.ObjectId, ref: 'Reply',  required: true},}],
    likes:[{  userId: {  type: Schema.Types.ObjectId, ref: 'User',  required: true ,unique: true},}],
},
    {
        timestamps: true,
    }
)




const commentModel = model('Comment', commentSchema)

export default commentModel