import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addPost = {
    params: joi.object().required().keys({}),
    body: joi.object({
        content: generalFields.name.min(1).max(500),
    }),
    file: generalFields.file,
    query: joi.object().required().keys({}),
}


export const getValidation = {
    params: joi.object().required().keys({}),
    body: joi.object().required().keys({}),
}



export const idPatchLikes = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}

export const getPostById = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}


export const updatePost = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object({
        content: generalFields.name.min(1).max(500),
    }),
    file: generalFields.file,
    query: joi.object().required().keys({}),
}


export const deletePost = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}


export const updatePostPrivacy = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object({
        privacy: generalFields.name.min(1).max(500),
    }),
    query: joi.object().required().keys({}),
}

