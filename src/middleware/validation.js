import joi from "joi";
import { Types } from 'mongoose'
const dataMethods = ["body", 'params', 'query', 'headers', 'file']

export const validation = (joiSchema) => {
    return (req, res, next) => {
        const validationErr = []
        dataMethods.forEach(ele => {
            if (joiSchema[ele]) {
                const validationResult = joiSchema[ele].validate(req[ele], { abortEarly: false })
                if (validationResult.error) {
                    validationErr.push(validationResult.error.details)
                }
            }
        })
        if (validationErr.length) {
            return res.status(403).json({ message: "Validation Error", validationErr })
        }
        return next()
    }
}

const validateObjectId = (value, helper) => {
    console.log({ value });
    console.log(helper);
    return Types.ObjectId.isValid(value) ? true : helper.message('In-valid objectId')
}

export const generalFields = {

    email: joi.string().pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)),
    password: joi.string(),
    cPassword: joi.string(),
    id: joi.string().custom(validateObjectId),
    name: joi.string(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
    })
}
