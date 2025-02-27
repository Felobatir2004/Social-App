import mongoose,  {Schema , Types, model} from "mongoose";


const postSchema = new Schema({

    content: {
        type:String,
        minLength:2,
        maxLength:5000,
        trim:true,
        required: function () {
            this.images?.length ? false : true;
        }
    },
    images:[{
        secure_url: String,
        public_id: String,
    }],
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
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
    customId:{
        type:String,
        unique: true,
    }
},{timestamps:true , toJSON:{virtuals:true} , toObject:{virtuals:true}}
);

postSchema.query.paginate = async function(page){
    page = page ? page : 1;
    const limit =4 ;
    const skip = (page-1) * limit;
    
    const data = await this.skip(skip).limit(limit);
    const items = await this.model.countDocuments();

    return {
        data,
        totalItems:items,
        currentPage:Number(page),
        totalPages: Math.ceil(items/limit),
        itemsPerPage:data.length,
    }
}
postSchema.virtual("comments", {
    ref:"Comment",
    foreignField:"postId",
    localField:"_id",
})

export const PostModel = mongoose.models.Post || model("Post",postSchema)