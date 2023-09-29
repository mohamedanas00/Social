import { generalFields } from "../../middleware/validation.js"

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
