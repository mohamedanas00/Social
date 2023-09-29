import { Schema, model } from "mongoose";
import * as hooks from '../hooks/user.hooks.js'

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true//delete space from first and end
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
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
        trim: true
    },
    age: {
        type: Number,
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    profilePicture: { type: Object  },
    coverPictures: { type: Array },

    //?Add This Field To Save Code Last created to can logIn
    confirmCode: {
        type: String,
        minlength: 4,
        maxlength: 4,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
    }
)

//!HOOKS
//?TAKE USER FULL_NAME AND Split it to (first and last name).
hooks.splitTheName(userSchema)


const userModel = model('User', userSchema)

export default userModel