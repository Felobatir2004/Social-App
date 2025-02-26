import { PostModel } from "../../DB/Models/post.model.js";
import { UserModel } from "../../DB/Models/user.model.js";
import * as dbService from "../../DB/dbService.js"
export const getAllUsersAndPosts = async (req , res , next) =>{

    const results = await Promise.all([PostModel.find({}), UserModel.find({})]);

    return res.status(200).json({success:true , data:{results}})

}

export const changeRole = async (req , res , next) =>{
    
    const { role , userId } = req.body

    const user = await dbService.findOneAndUpdate({
        model:UserModel,
        filter:{_id:userId},
        data:{role},
        options:{new:true}
    })
    
    return res.status(200).json({success:true , data:{user}})

}