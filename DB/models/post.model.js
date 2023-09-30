import { Schema, model } from "mongoose";
import * as hooks from '../hooks/post.hook.js'

const postSchema = new Schema({
    content:{type:String, minlength:1,maxlength:500,trim: true,required:true},
    images:{ type:Array },
    video:{ type: Object },
    likes:[{  userId: {  type: Schema.Types.ObjectId, ref: 'User',  required: true},}],
    privacy:{ type:String, enum:['only','public'], default:'public' },
    createdBy:{type: Schema.Types.ObjectId, ref: 'User',  required: true},
    isDeleted: {type: Boolean, default: false}
},
    {
        toJSON: { virtuals: true },
        timestamps: true,
    }
)

//!I use virtual For Cleaner Code 
//!-api response more faster and Fixable
//*Rather than using array of comments
postSchema.virtual('Comments', {
    localField: '_id',
    foreignField: 'PostId',
    ref: 'Comment'
})

hooks.deleteOne_PostH(postSchema)



const postModel = model('Post', postSchema)

export default postModel