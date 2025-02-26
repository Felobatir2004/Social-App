import * as dbService from "../../DB/dbService.js";
import { PostModel } from "../../DB/Models/post.model.js";
import {CommentModel} from "../../DB/Models/comment.model.js"
import cloudinary from "../../utils/fileUploading/cloudinaryConfig.js";
import { roleType } from "../../DB/Models/user.model.js";
export const createComment = async (req,res,next) =>{

    const {postId} = req.params;
    const {text} = req.body;

    const post = await dbService.findOne({
        model :PostModel,
        id:postId
    })
    if (!post) return next(new Error("Post not found",{cause:404}))
    
    let image 
    //check if send image
    if(req.file)
    {
        //upload cloudinary
        const {secure_url,public_id}= await cloudinary.uploader.upload(
            req.file.path,
            {folder: `Posts/${post.createdBy}/post/${post.customId}/comments`}
        );
        image = {secure_url,public_id}
    }

    const comment = await dbService.create({
        model:CommentModel,
        data:{
            text,
            createdBy:req.user._id,
            postId:post._id,
            image,
        }
    })
    return res.status(200).json({success:true , data:{comment}})
}

export const updateComment = async (req,res,next) =>{

    const {commentId} = req.params;
    const {text} = req.body;

    const comment = await dbService.findById({
        model :CommentModel,
        id:commentId
    })
    if (!comment) return next(new Error("comment not found",{cause:404}))
    
    const post = await dbService.findOne({
        model :PostModel,
        filter: {
            _id:comment.postId,
            isDeleted:false,
        }
    })
    if (!post) return next(new Error("Post not found",{cause:404}))
    
    if(comment.createdBy.toString() !== req.user._id.toString() )
        return next(new Error("You are not authorized to update this comment",{cause:401}))
    let image 
    //check if send image
    if(req.file)
    {
        //upload cloudinary
        const {secure_url,public_id}= await cloudinary.uploader.upload(
            req.file.path,
            {folder: `Posts/${post.createdBy}/post/${post.customId}/comments`}
        );
        image = {secure_url,public_id}

        if(comment.image){
            await cloudinary.uploader.destroy(comment.image.public_id)
        }

        comment.image = image
    }

    comment.text = text ? text : comment.text
    await comment.save()
    return res.status(200).json({success:true , data:{comment}})
}

export const softDeleteComment = async (req,res,next) =>{

    const {commentId} = req.params;

    const comment = await dbService.findById({
        model :CommentModel,
        id:commentId
    })
    if (!comment) return next(new Error("comment not found",{cause:404}))
    
    const post = await dbService.findOne({
        model :PostModel,
        filter: {
            _id:comment.postId,
            isDeleted:false,
        }
    })
    if (!post) return next(new Error("Post not found",{cause:404}))
    
    //user who created the comment
    const commentOwner = comment.createdBy.toString() == req.user._id.toString();

    //user who created the post
    const postOwner = post.createdBy.toString() == req.user._id.toString();

    //admin
    const admin = req.user.role === roleType.Admin;

    if(!(commentOwner || postOwner || admin) )
        return next(new Error("You are not authorized to delete this comment",{cause:401}))

    comment.isDeleted = true;
    comment.deletedby = req.user._id;
    await comment.save()
    return res.status(200).json({success:true , data:{comment}})
}

export const getAllComments = async (req,res,next) =>{

    const {postId} = req.params;

    const post = await dbService.findOne({
        model :PostModel,
        filter: {
            _id:postId,
            isDeleted:false,
        }
    })

    const comments = await dbService.find({
        model :CommentModel,
        filter: {
            postId:post._id,
            isDeleted:false,
            parentComment:{$exists:false}
        },
        populate:[{path:"replies"}]
    })
    
    return res.status(200).json({success:true , data:{comments}})
}

export const likeAndUnlikeComment = async (req, res,next) => {
    const {commentId} = req.params;
    const userId = req.user._id;
    
    const comment = await dbService.findOne({
        model:CommentModel,
        filter:{_id:commentId,isDeleted:false},
    });
    if(!comment) return next(new Error("comment not found",{cause:404}))

    const isUserLiked = comment.likes.find(
        (user) => user.toString() === userId.toString()
    );

    if (!isUserLiked) {
        comment.likes.push(userId);
    }
    else{
        comment.likes = comment.likes.filter(
            (user) => user.toString() !== userId.toString()
        );
    }
    await comment.save()


    return res.status(200).json({success:true , data:{comment}})

}

export const addReply = async (req, res,next) => {
    const {postId,commentId} = req.params;
    
    //parrent comment
    const comment = await dbService.findOne({
        model:CommentModel,
        filter:{_id:commentId,isDeleted:false},
    });
    if(!comment) return next(new Error("comment not found",{cause:404}))

    const post = await dbService.findOne({
        model :PostModel,
        filter: {
            _id:postId,
            isDeleted:false,
        }
    })
    if (!post) return next(new Error("Post not found",{cause:404}))
    
    let image 
    //check if send image
    if(req.file)
    {
        //upload cloudinary
        const {secure_url,public_id}= await cloudinary.uploader.upload(
            req.file.path,
            {folder: `Posts/${post.createdBy}/post/${post.customId}/comments/${commentId}`}
        );
        image = {secure_url,public_id}
    }

    const reply = await dbService.create({
        model:CommentModel,
        data:{
            ...req.body,
            createdBy:req.user._id,
            postId,
            image,
            parentComment:comment._id
        }
    })
    return res.status(201).json({success:true , data:{reply}})

}

export const deleteComment = async (req, res,next) => {
    const {commentId} = req.params;

    const comment = await dbService.findById({
        model :CommentModel,
        id:commentId
    })
    if (!comment) return next(new Error("comment not found",{cause:404}))
    
    const post = await dbService.findOne({
        model :PostModel,
        filter: {
            _id:comment.postId,
            isDeleted:false,
        }
    })
    if (!post) return next(new Error("Post not found",{cause:404}))
    
    //user who created the comment
    const commentOwner = comment.createdBy.toString() == req.user._id.toString();

    //user who created the post
    const postOwner = post.createdBy.toString() == req.user._id.toString();

    //admin
    const admin = req.user.role === roleType.Admin;

    if(!(commentOwner || postOwner || admin) )
        return next(new Error("You are not authorized to delete this comment",{cause:401}))

    // delete all nested replies
    await comment.deleteOne()
    return res.status(200).json({success:true , message:"comment deleted"})
}