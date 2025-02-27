import { nanoid } from "nanoid";
import cloudinary from "../../utils/fileUploading/cloudinaryConfig.js";
import * as dbService from "../../DB/dbService.js"
import { PostModel } from "../../DB/Models/post.model.js";
import { roleType } from "../../DB/Models/user.model.js";
import { CommentModel } from "../../DB/Models/comment.model.js";
export const createPost = async (req, res) => {
    const {content} = req.body;
    const allImages= []
    let customId
    if(req.files.length){
        customId = nanoid(5)
        for( const file of req.files ){
            const { secure_url,public_id}= await cloudinary.uploader.upload(
                file.path,
                {folder:`Posts/${req.user._id}/post/${customId}` }
            )
            allImages.push({secure_url,public_id})
        }
    }

    const post = await dbService.create({
        model:PostModel,
        data:{
            content,
            images: allImages,
            createdBy: req.user._id,
            customId,
        }
    })
    return res.status(200).json({success:true , data:{post}})
}

export const updatePost = async (req, res) => {
    const {content} = req.body;
    const {postId} = req.params;

    const post = await dbService.findOne({
        model:PostModel,
        filter:{_id:postId,createdBy:req.user._id }
    });
    if(!post) return next(new Error("Post not found",{cause:404}))

    const allImages= []

    if(req.files.length){
        for( const file of req.files ){
            for( const file of post.images ){
                await cloudinary.uploader.destroy(file.public_id)
            }

            const {secure_url,public_id}= await cloudinary.uploader.upload(
                file.path,
                {folder:`Posts/${req.user._id}/post/${post.customId}` }
            )
            allImages.push({secure_url,public_id})
        }
        post.images = allImages;
    }

    post.content = content ? content: post.content;
    await post.save()
    return res.status(200).json({success:true , data:{post}})
}

export const softDeletePost = async (req, res) => {
    const {postId} = req.params;

    const post = await dbService.findById({
        model:PostModel,
        id:{_id:postId }
    });
    if(!post) return next(new Error("Post not found",{cause:404}))

    if(post.createdBy.toString() === req.user._id.toString() || 
    req.user.role === roleType.Admin) 
    {
        post.isDeleted = true;
        post.deletedby = req.user._id
        await post.save()
        return res.status(200).json({success:true , data:{post}})
    }
    else{
        return next(new Error("You are not authorized to delete this post",{cause:401}))
    }

}

export const restorePost = async (req, res) => {
    const {postId} = req.params;

    const post = await dbService.findOneAndUpdate({
        model:PostModel,
        filter:{_id:postId , isDeleted:true , deletedby: req.user._id},
        data:{
            isDeleted:false,
            $unset:{deletedby: ""},
        },
        options:{new:true}
    });
    if(!post) return next(new Error("Post not found",{cause:404}))

    return res.status(200).json({success:true , data:{post}})


}

export const getSinglePost = async (req, res) => {
    const {postId} = req.params;

    const post = await dbService.findOne({
        model:PostModel,
        filter:{_id:postId , isDeleted:false},
        populate:[
            {path:"createdBy",select:"userName email image -_id"},
            {
                path:"comments",
                select:"text image -_id" , 
                match:{parentComment:{$exists:false}},
                populate:[
                    {path:"createdBy",select:"userName email image -_id"},
                    {path:"replies"}
                ]
            },
        ]
    });
    if(!post) return next(new Error("Post not found",{cause:404}))

//    const comment = await dbService.find({
//        model:CommentModel,
//        filter:{postId , isDeleted:false}, 
//    });
    return res.status(200).json({success:true , data:{post}})


}

export const activePosts = async (req, res) => {
    
    let posts

 //   if(req.user.role === roleType.Admin){
 //       posts = await dbService.find({
 //           model:PostModel,
 //           filter:{isDeleted:false},
 //           populate:[{path:"createdBy",select:"userName  image "}]
 //       })
 //   }
 //   else{     
 //       posts = await dbService.find({
 //       model:PostModel,
 //       filter:{ isDeleted:false , createdBy: req.user._id},
 //       populate:[{path:"createdBy",select:"userName  image "}]
//        });
//    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    posts = await dbService.find({
        model:PostModel,
        filter:{isDeleted:false},
        populate:[{path:"createdBy",select:"userName  image "}]
    })

    let results = []
    for (const post of posts) {
        const comment = await dbService.find({
            model:CommentModel,
            filter:{postId:post._id , isDeleted:false},
            select:"text image -_id"
        })
        results.push({post, comment})    
    }
*/
//////////////////////////////////////////////////////////////////////////////
    
/*
    const curser = PostModel.find({isDeleted:false}).cursor()
    let results = []
   for (let post = await curser.next(); post != null; post = await curser.next()) {
        const comment = await dbService.find({
            model:CommentModel,
            filter:{postId:post._id , isDeleted:false},
            select:"text image -_id"
        })
        results.push({post, comment}) 
    }
    return res.status(200).json({success:true , data:{results}})
*/

let {page} = req.query;

const results = await PostModel.find({isDeleted:false}).paginate(page)
return res.status(200).json({success:true , data: {results}})

}

export const freezedPosts = async (req, res) => {
    let posts

    if(req.user.role === roleType.Admin){
        posts = await dbService.find({
            model:PostModel,
            filter:{isDeleted:true},
            populate:[{path:"createdBy",select:"userName  image "}]
        })
    }
    else{     
        posts = await dbService.find({
        model:PostModel,
        filter: { isDeleted: true, createdBy: req.user._id },
        populate:[{path:"createdBy",select:"userName  image "}]
        });
    }
    return res.status(200).json({success:true , data:{posts}})

}

export const likeAndUnlike = async (req, res,next) => {
    const {postId} = req.params;
    const userId = req.user._id;
    
    const post = await dbService.findOne({
        model:PostModel,
        filter:{_id:postId,isDeleted:false},
    });
    if(!post) return next(new Error("Post not found",{cause:404}))

    const isUserLiked = post.likes.find(
        (user) => user.toString() === userId.toString()
    );

    if (!isUserLiked) {
        post.likes.push(userId);
    }
    else{
        post.likes = post.likes.filter(
            (user) => user.toString() !== userId.toString()
        );
    }
    await post.save()

    const populatedUser = await dbService.findOne({
        model:PostModel,
        filter:{_id:postId,isDeleted:false},
        populate:[{path:"likes",select:"userName  image -_id"}]
    });
    return res.status(200).json({success:true , data:{populatedUser}})

}