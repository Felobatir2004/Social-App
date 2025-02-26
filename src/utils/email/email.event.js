import { EventEmitter } from "events";
import { sendEmails, subject } from "./sendEmail.js";
import { customAlphabet } from "nanoid";
import { hash } from "../hashing/hash.js";
import { UserModel } from "../../DB/Models/user.model.js";
import { template } from "./generateHtml.js";
import * as dbService from "../../DB/dbService.js"
export const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail",async(email,userName,id)=>{
    await sendCode({
        data:{email,userName,id},
        subjectType:subject.verifyEmail
    })
})

emailEmitter.on("forgetPasssword",async(email,userName,id)=>{
    await sendCode({
        data:{email,userName,id},
        subjectType:subject.resetPassword
    })
})

emailEmitter.on("updateEmail",async(email,userName,id)=>{
    await sendCode({
        data:{email,userName,id},
        subjectType:subject.updatEmail
    })
})

export const sendCode = async ({data = {}, subjectType = subject.verifyEmail})=>{
    
    const {userName , email , id} = data;

    const otp = customAlphabet("1234567890",5)();

    const hashOTP = hash({plainText:otp});
    
    let updateData = {}

    switch (subjectType) {
        case subject.verifyEmail:
            updateData = {confirmEmailOTP:hashOTP}
            break;
        case subject.resetPassword:
            updateData = {forgetPasswordOTP:hashOTP}
            break;
        case subject.updatEmail:
            updateData = {tempEmailOTP:hashOTP}
            break;
        default:
            break;
    }

    await dbService.UpdateOne({
        model: UserModel,
        filter: {_id:id},
        data:updateData,
    })

    await sendEmails({
        to: email,
        subject:subjectType,
        html:template(otp,userName,subjectType)
    });
}