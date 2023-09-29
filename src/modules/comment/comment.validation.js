import { generalFields } from "../../middleware/validation.js"
import joi from "joi";


export const addComment = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object({
        commentBody:joi.string().min(1).max(300).required()
    }).required(),
    query: joi.object().required().keys({}),
}


export const updateComment = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object({
        commentBody:joi.string().min(1).max(300).required()
    }).required(),
    query: joi.object().required().keys({}),
}



export const deleteComment = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}


export const likeComment = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}

export const unlikeComment = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}