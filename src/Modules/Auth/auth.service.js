import {providersTypes, roleType, UserModel} from "../../DB/Models/user.model.js"
import { compareHash, hash } from "../../utils/hashing/hash.js"
import { emailEmitter } from "../../utils/email/email.event.js"
import { generateToken, verifyToken } from "../../utils/token/token.js"
import {OAuth2Client} from 'google-auth-library';
import * as dbService from "../../DB/dbService.js"
import { decodedToken, tokenTypes } from "../../middlewares/auth.middleware.js";

export const register = async (req ,res,next)=>{
    const {userName , email , password , role }= req.body

    const user = await dbService.findOne({model: UserModel , filter: {email}})
    if(user) return next (new Error("User already exists",{cause: 409}))

    //const hashPassword = hash({plainText:password})
    const newUser = await dbService.create({
        model: UserModel,
        data:{
        userName , 
        email , 
        password,
        role,
    }
})
    
    emailEmitter.emit("sendEmail",email,userName)
    return res.status(200).json({success:true , message :"user Registered successfully", newUser})
}

export const verifyEmail = async (req ,res,next)=>{
    const {code , email }= req.body

    const user = await dbService.findOne({model: UserModel , filter: {email}})

    if(!user) return next(new Error("user not found ",{cause:404}))
    
    if(user.confirmEmail===true)
        return next (new Error("Email already verified",{cause:409}))
    if(!compareHash({plainText:code , hash:user.confirmEmailOTP}))
        return next (new Error("Invalid code",{cause:400}))
    await dbService.UpdateOne({
        model:UserModel,
        filter:{email},
        data:{
            confirmEmail:true ,
            $unset: {confirmEmialOTP:""}
        }
    })
    return res.status(200).json({success:true , message :"email verify successfully"})
}

export const login = async (req,res,next)=>{
    const {email , password} =req.body;

    const user =await dbService.findOne({model:UserModel , filter: {email}})
    if(!user) return next(new Error("user not found",{cause: 404}))
    
    if(!user.confirmEmail)
        return next (new Error("email not verified",{cause: 401}))
    
    if(!compareHash({plainText: password, hash: user.password}))
        return next (new Error("invalid password",{cause: 400}))

    const access_token = generateToken({
        payload:{id:user._id},
        signature: user.role === roleType.User
          ? process.env.USER_ACCESS_TOKEN 
          : process.env.ADMIN_ACCESS_TOKEN,
        options:{expiresIn: process.env.ACCESS_TOKEN_EXPIRESS}
    })

    const refresh_token = generateToken({
        payload:{id:user._id},
        signature: user.role === roleType.User
          ? process.env.USER_ACCESS_TOKEN 
          : process.env.ADMIN_ACCESS_TOKEN,
        options:{expiresIn: process.env.REFRESH_TOKEN_EXPIRESS}

    })
    return res.status(200).json({
        success: true,
         tokens: {
            access_token,
            refresh_token, 
         }
    })
}

export const refresh_token = async (req,res,next)=>{
    const {authoriztion} = req.headers;
    const user = await decodedToken({
        authoriztion,
        tokenType:tokenTypes.refresh,
        next
    })
    const access_token = generateToken({
        payload:{id:user._id},
        signature: user.role === roleType.User
            ? process.env.USER_ACCESS_TOKEN 
            : process.env.ADMIN_ACCESS_TOKEN,
    })
    
    const refresh_token = generateToken({
        payload:{id:user._id},
        signature: user.role === roleType.User
            ? process.env.USER_REFRESH_TOKEN 
            : process.env.ADMIN_REFRESH_TOKEN,
    })
    return res.status(200).json({
        success: true,
         tokens: {
            access_token,
            refresh_token, 
         }
    })
}

export const forget_password = async (req,res,next)=>{

    const { email } =req.body

    const user = await dbService.findOne({model:UserModel , filter: {email,isDeleted:false}})
    if(!user) return next(new Error("User Not Found", {cause: 404}))
    
    emailEmitter.emit("forgetPassword",email,user.userName)
    return res.status(200).json({
        success: true,
        message:"email sent successfully"
    })
}

export const reset_password = async (req,res,next)=>{

    const { email , code , password } =req.body

    const user = await dbService.findOne({model:UserModel , filter: {email,isDeleted:false}})
    if(!user) return next(new Error("User Not Found", {cause: 404}))

    if(!compareHash({plainText: code, hash: user.forgetPasswordOTP}))
        return next(new Error("IN valid code",{cause:400}))

    const hashPassword = hash({plainText:password})

    await dbService.UpdateOne({filter:{email},data:{password: hashPassword}, $unset:{forgetPasswordOTP:""}})
    return res.status(200).json({
        success: true,
        message:"password reseted successfully"
    })
}

export const loginWithGmail = async (req,res,next)=>{

    const {idToken} = req.body;
    const client = new OAuth2Client();
    async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    return payload;
    }
    const {name , email, picture, email_verified}= await verify();

    if(!email_verified)
        return next(new Error("email not verified",{cause: 401}))
    let user = await dbService.findOne({model:UserModel , filter: {email,isDeleted:false}})

    if(user?.providers === providersTypes.System)
        return next(new Error("User Already Exist",{cause:409}))
    if(!user)
    {
        user = await dbService.create({
            model: UserModel,
            data:{
                userName: name,
                email,
                image: picture,
                confirmEmail: email_verified,
                providers: providersTypes.Google
            }
        })
    };
    
    const access_token = generateToken({
        payload:{id:user._id},
        signature: user.role === roleType.User
          ? process.env.USER_ACCESS_TOKEN 
          : process.env.ADMIN_ACCESS_TOKEN,
        options:{expiresIn: process.env.ACCESS_TOKEN_EXPIRESS}
    })

    const refresh_token = generateToken({
        payload:{id:user._id},
        signature: user.role === roleType.User
          ? process.env.USER_ACCESS_TOKEN 
          : process.env.ADMIN_ACCESS_TOKEN,
        options:{expiresIn: process.env.REFRESH_TOKEN_EXPIRESS}

    })
    return res.status(200).json({
        success:true,
        tokens: {
            access_token,
            refresh_token, 
        }
    })
    
}