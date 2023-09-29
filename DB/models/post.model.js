import { Schema, model } from "mongoose";

const postSchema = new Schema({
    content:{type:String, minlength:1,maxlength:500,required:true},
    images:{ type:Array },
    video:{ type: Object },
    likes:[{  userId: {  type: Schema.Types.ObjectId, ref: 'User',  required: true},}],
    privacy:{ type:String, enum:['only','public'], default:'public' },
    createdBy:{type: Schema.Types.ObjectId, ref: 'User',  required: true},
    comments:[{ commentId: {  type: Schema.Types.ObjectId, ref: 'Comment',  required: true},}],
},
    {
        timestamps: true,
    }
)




const postModel = model('Post', postSchema)

export default postModel