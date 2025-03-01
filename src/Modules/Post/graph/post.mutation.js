import * as dbService from "../../../DB/dbService.js"
import { PostModel } from "../../../DB/Models/post.model.js";
import { roleType } from "../../../DB/Models/user.model.js";
import { authentication } from "../../../middlewares/graph/graph.auth.middleware.js";
import { validation } from "../../../middlewares/graph/graph.validation.middleware.js";
import { likePostGraph } from "../post.validation.js";

export const likePosts = async(parent , args) =>{
    const {postId , authorization}= args;
    
    await validation( likePostGraph, args);
    const user = await authentication({
        authorization,
        accessRoles:roleType.User
    });

    const post = await dbService.findByIdAndUpdate({
        model:PostModel,
        id:{_id:postId},
        data:{$addToSet:{likes: user._id}},
        options:{new:true}
    });

    return {message: "Done" , statusCode: 200 , data:post}
}