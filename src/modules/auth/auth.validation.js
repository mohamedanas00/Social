import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const signUp = {
    params: joi.object().required().keys({}),
    body: joi.object({
        name: generalFields.name.min(3).max(30).required(),
        email: generalFields.email.required(),
        password: generalFields.password.required(),
        cPassword: generalFields.cPassword.valid(joi.ref("password")).required(),
        phone: joi.string().trim().pattern(/^(010|012|011|015)\d{8}$/),
        age:joi.string()
    }),
    query: joi.object().required().keys({}),
}

export const confirmEmail = {
    params: joi.object().required().keys({}),
    body: joi.object({
        email: generalFields.email.required(),
        code: joi.string().min(4).max(4).required()
    }),
    query: joi.object().required().keys({}),

}

export const logIn = {
    params: joi.object().required().keys({}),
    body: joi.object({
        email: generalFields.email.required(),
        password: generalFields.password.required()
    }),
    query: joi.object().required().keys({}),
}

export const sendCode = {
    params: joi.object().required().keys({}),
    body: joi.object({
        email: generalFields.email.required(),
    }),
    query: joi.object().required().keys({}),

}

export const restPassword = {
    params: joi.object().required().keys({}),
    body: joi.object({
        email: generalFields.email.required(),
        password: generalFields.password.required(),
        code: joi.string().min(4).max(4).required()
    }),
    query: joi.object().required().keys({}),
}