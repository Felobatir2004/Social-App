import mongoose,  {Schema , Types, model} from "mongoose";
import cloudinary from "../../utils/fileUploading/cloudinaryConfig.js";


const commentSchema = new Schema({

    text: {
        type:String,
        minLength:2,
        maxLength:5000,
        trim:true,
        required: function () {
            this.images?.length ? false : true;
        }
    },
    image:{
        secure_url: String,
        public_id: String,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: Types.ObjectId,
        ref: "Post",
        required: true
    },
    deletedby: {
        type: Types.ObjectId,
        ref: "User",
    },
    likes:[{
       type: Types.ObjectId,
       ref: "User", 
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    parentComment:{
        type: Types.ObjectId,
        ref: "Comment",
    },
},{timestamps:true, toJSON:{virtuals:true} , toObject:{virtuals:true}});

//hook -------------> deleteOne
commentSchema.post("deleteOne", {document:true , query:false} , async function(doc,next) {
    if(doc.image.secure_url){
        await cloudinary.uploader.destroy(doc.image.public_id)
    }
    const replies = await this.constructor.find({parentComment:doc._id})
    if(replies.length>0)
    {
        for(const reply of replies)
        {
            await reply.deleteOne()
        }
    }
    return next()
})

commentSchema.virtual("replies", {
    ref: "Comment",
    localField: "_id",
    foreignField: "parentComment",
})
export const CommentModel = mongoose.models.Comment || model("Comment",commentSchema)