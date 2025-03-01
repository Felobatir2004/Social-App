import * as dbService from "../../../DB/dbService.js"
import {PostModel} from "../../../DB/Models/post.model.js"
export const getAllPosts = async(parent , args) =>{
    const posts = await dbService.find({
        model:PostModel,
        filter:{isDeleted:false},
        populate:[{path:"createdBy"} ]
    })
    return {message: "Done" , statusCode: 200 , data:posts}
}

