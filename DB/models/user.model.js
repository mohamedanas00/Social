import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true//delete space from first and end
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    age: {
        type: Number,
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true,
    }
)

const userModel = model('User', userSchema)

export default userModel