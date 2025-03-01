import joi from "joi"
import { generalField } from "../../middlewares/validation.middleware.js"
import { auth } from "google-auth-library";

export const createPostSchema = joi
.object({
    content: joi.string().min(2).max(5000),
    file: joi.array().items(joi.object(generalField.fileObject))
})
.or("content" , "file");

export const updatePostSchema = joi
.object({
    postId: generalField.id.required(),
    content: joi.string().min(2).max(5000),
    file: joi.array().items(joi.object(generalField.fileObject))
})
.or("content" , "file");

export const softDeletePostSchema = joi
.object({
    postId: generalField.id.required(),
})

export const restorePostSchema = joi
.object({
    postId: generalField.id.required(),
})

export const getSinglePostSchema = joi
.object({
    postId: generalField.id.required(),
})

export const likeAndUnlikePostSchema = joi
.object({
    postId: generalField.id.required(),
})



export const likePostGraph = joi
.object({
    postId: generalField.id.required(),
    authorization: joi.string().required()
})
