import { roleType, UserModel } from "../../DB/Models/user.model.js"
import * as dbservice from "../../DB/dbService.js"
export const changeRole = async (req , res , next) =>{

    const allRoles = Object.values(roleType)    
    const userReq = req.user
    const targetUser = await dbservice.findById({
        model:UserModel,
        id : {_id:req.body.userId},
    })

    const userReqRole = userReq.role
    const targetUserRole = targetUser.role

    const userReqIndex = allRoles.indexOf(userReqRole)
    const targetUserIndex = allRoles.indexOf(targetUserRole)

    const canModify = userReqIndex < targetUserIndex

    if(!canModify)
        return next(new Error("You are not authorized to modify this user role",{cause:401}))
    return next()
}