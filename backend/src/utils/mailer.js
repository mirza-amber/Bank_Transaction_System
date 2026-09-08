const nodemailer = require("nodemailer")
const { ApiError } = require("./ApiError.js")
const User = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const crypto = require("crypto");

const sendMailer = async ({email, emailType, userId})=>{
    const hashedToken = crypto.randomUUID().toString();
    if(emailType === "VERIFY"){
        await User.findByIdandUpdate(userId,
            {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now()+360000 // valid for six minutes
            }
        )
    }
    else if(emailType === "RESET"){
        await User.findByIdandUpdate(userId,
            {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now()+360000 // valid for six minutes
            }
        )
    }

    try{
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: "2525",
            secure: false,
            auth:{
                user:process.env.MAILTRAP_MAILER_USERNAME,
                pass:process.env.MAILTRAP_MAILER_PASSWORD
            }
        })

        await transporter.verify();
        console.log("Server is ready to take our messages");

        const mailOptions = {
            from:"",
            to:email,
            subject:(emailType==="verify")?"Verify your email":"Reset your password",
            text:"",
            html:`<p><h4>Your token is ${hashedToken}</h4></p>`,
        }

        return await transporter.sendMail(mailOptions);
    }
    catch(error){
        console.log("Error sending mail: ", error);
        throw new ApiError(400, "Error sending mail");
    }
}

module.exports = {
    sendMailer
}