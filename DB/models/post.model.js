import { Schema, model } from "mongoose";
import * as hooks from '../hooks/post.hook.js'

const postSchema = new Schema({
    content:{type:String, minlength:1,maxlength:500,trim: true,required:true},
    images:{ type:Array },
    video:{ type: Object },
    likes:[{  userId: {  type: Schema.Types.ObjectId, ref: 'User',  required: true},}],
    privacy:{ type:String, enum:['only','public'], default:'public' },
    createdBy:{type: Schema.Types.ObjectId, ref: 'User',  required: true},
    comments:[{ commentId: {  type: Schema.Types.ObjectId, ref: 'Comment',  required: true},}],
    isDeleted: {type: Boolean, default: false}
},
    {
        timestamps: true,
    }
)


hooks.deleteOne_PostH(postSchema)



const postModel = model('Post', postSchema)

export default postModel