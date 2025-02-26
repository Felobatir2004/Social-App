 
import joi from "joi";
import { generalField } from "../../middlewares/validation.middleware.js";

export const createCommentSchema = joi
.object({
    text: joi.string().min(2).max(5000),
    file:joi.object(generalField.fileObject),
    postId: generalField.id.required(),
}).or("text","file")

export const updateCommentSchema = joi
.object({
    text: joi.string().min(2).max(5000),
    file:joi.object(generalField.fileObject),
    commentId: generalField.id.required(),
}).or("text","file")

export const softDeleteCommentSchema = joi
.object({
    commentId: generalField.id.required(),
}).required()

export const getAllCommentSchema = joi
.object({
    postId: generalField.id.required(),
}).required()

export const likeAndUnlikeCommentSchema = joi
.object({
    commentId: generalField.id.required(),
}).required()

export const addReplySchema = joi
.object({
    text: joi.string().min(2).max(5000),
    file:joi.object(generalField.fileObject),
    postId: generalField.id.required(),
    commentId: generalField.id.required(),
}).or("text","file")

export const deleteCommentSchema = joi
.object({
    commentId: generalField.id.required(),
}).required()