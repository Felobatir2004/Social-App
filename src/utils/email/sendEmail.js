import nodemailer from "nodemailer";

export const sendEmails = async ({to,subject,html}) =>{


    //sender
    const transporter = nodemailer.createTransport({
        service:"gmail",
        port: 465,
        secure: true,
        auth:{
            user: process.env.EMAIL ,
            pass:process.env.PASS,//app password

        }
    });

    const info = await transporter.sendMail({
        from: `"social media Application "<${process.env.EMAIL}>`,
        to,
        subject,
        html,

    })
    return info.rejected.length === 0 ? true : false;

}
export const subject = {
    resetPassword : "Reset Password",
    verifyEmail:"verify Email",
    updatEmail : "update Email"

}

