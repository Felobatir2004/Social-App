import { verifyToken } from "../../utils/token/token.js"
import * as dbService from "../../DB/dbService.js"
import { UserModel } from "../../DB/Models/user.model.js"
export const tokenTypes = {
    access:"access",
    refresh:"refresh"
}


export const authentication = async ({
    authorization = "",
    tokenType = tokenTypes.access,
    accessRoles = [],
})=>{
    
        const [bearer, token] = authorization.split(" ") || []
    
        if(!bearer || !token)
            throw new Error("In-valid Token")

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
        if(!user) throw new Error("user not found",{cause: 404})
        
        if(user.changeCredentials?.getTime >=decoded.iat * 1000)
            throw new Error("In-valid token",{cause:401})

        if(!accessRoles.includes(user.role))
            throw new Error("unauthorized",{cause:403})

        return user;
}

