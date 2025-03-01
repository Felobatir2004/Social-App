import {asyncHandler} from "../utils/error handling/asyncHandler.js"
import { verifyToken } from "../utils/token/token.js"
import * as dbService from "../DB/dbService.js"
import { UserModel } from "../DB/Models/user.model.js"
export const tokenTypes = {
    access:"access",
    refresh:"refresh"
}


export const decodedToken = async ({authorization = "",tokenType = tokenTypes.access,next= {}})=>{
    
        const [bearer, token] = authorization.split(" ") || []
    
        if(!bearer || !token)
            return next(new Error("In-valid Token",{cause:401}))
    
        let ACCESS_SIGNATURE = undefined
        let REFRESH_SIGNATURE = undefined

    
        switch (bearer) {
            case "Admin":
                ACCESS_SIGNATURE = process.env.ADMIN_ACCESS_TOKEN
                REFRESH_SIGNATURE = process.env.ADMIN_REFRESH_TOKEN
                break;
            case "User":
                ACCESS_SIGNATURE = process.env.USER_ACCESS_TOKEN
                REFRESH_SIGNATURE = process.env.USER_REFRESH_TOKEN
                break;
            default:
                break;
        }
    
        const decoded = verifyToken({
            token , 
            signature:tokenTypes.access ? ACCESS_SIGNATURE : REFRESH_SIGNATURE
        })
        
        const user = await dbService.findOne({model:UserModel , filter: {_id:decoded.id,isDeleted:false}})
        if(!user) return next(new Error("User Not Found",{cause: 404}))
        
        if(user.changeCredentials?.getTime >=decoded.iat * 1000)
            return next(new Error("In-valid token",{cause: 400}))
        return user;
}

export const authentication =  () =>{
    return asyncHandler(async(req,res,next)=>{
        const {authorization} = req.headers;
        req.user = await decodedToken({
            authorization,
            tokenType:tokenTypes.access,
            next,
        })
        return next()
    })
}

export const allowTo = (role = [])=>{
    return asyncHandler(async(req,res,next)=>{
        if(!role.includes(req.user.role))
            return next(new Error("unauthorized",{cause:403}))
        return next()
    })
}