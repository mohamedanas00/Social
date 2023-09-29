import commentModel from "../models/comment.model";
import replyCommentModel from "../models/commentReplay.model";
import postModel from "../models/post.model";




export const splitTheName = (Schema) => {
    Schema.pre('save', async function (done) {
            const name = this.name
            //*delete any space from first and end using trim().
            let fullName = name.trim();
            console.log(fullName);
            //*by using split :split fullName to array using a space.
            const splitName = fullName.split(' ');
            //*add firstName and lastName to req after Done() will save in Schema
            this.firstName=splitName[0]
            this.lastName=splitName[splitName.length - 1]

        done()
    })
}


export const deleteOne_UserH= (Schema)=>{
    Schema.post('deleteOne', { document: false, query: true } ,async function () {
        await replyCommentModel.deleteMany({
            createdBy: this.getQuery()._id
        }),
        await postModel.deleteMany({
            createdBy: this.getQuery()._id
        }),
        await commentModel.deleteMany({
            createdBy: this.getQuery()._id
        })
    })
}