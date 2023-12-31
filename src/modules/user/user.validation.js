import { generalFields } from "../../middleware/validation.js"
import joi from "joi";

export const addProfilePicture = {
    params: joi.object().required().keys({}),
    body: joi.object().required().keys({}),
    file: generalFields.file.required(),
    query: joi.object().required().keys({}),
}


export const addCoverPictures = {
    params: joi.object().required().keys({}),
    body: joi.object().required().keys({}),
    file: generalFields.file.required(),
    query: joi.object().required().keys({}),
}


export const softDelete = {
    params: joi.object().required().keys({}),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}


export const updatePassword = {
    params: joi.object().required().keys({}),
    body: joi.object({
        password:generalFields.password.required(),
        cPassword: generalFields.cPassword.valid(joi.ref("password")).required(),
    }).required(),
    query: joi.object().required().keys({}),
}

export const getUserProfile = {
    params: joi.object().required().keys({}),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}


export const updateProfile = {
    params: joi.object().required().keys({}),
    body: joi.object({
        firstName:joi.string(),
        lastName: joi.string(),
        email:generalFields.email,
        phone: joi.string().trim().pattern(/^(010|012|011|015)\d{8}$/),
        age:joi.number().min(13)
    }).required(),
    query: joi.object().required().keys({}),
}


export const addVideoForPost = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object().required(),
    query: joi.object().required().keys({}),
}