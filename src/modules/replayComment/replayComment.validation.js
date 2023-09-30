import { generalFields } from "../../middleware/validation.js"
import joi from "joi";


export const addReplyComment = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object({
        replyBody:joi.string().min(1).max(300).required()
    }).required(),
    query: joi.object().required().keys({}),
}


export const updateReplyComment = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object({
        replyBody:joi.string().min(1).max(300).required()
    }).required(),
    query: joi.object().required().keys({}),
}



export const deleteReplyComment = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}


export const likeReplyComment = {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}

export const unlikeReplyComment= {
    params: joi.object({
        id:generalFields.id.required()
    }).required(),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}