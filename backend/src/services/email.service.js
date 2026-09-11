const nodemailer = require("nodemailer")
const { ApiError } = require("../utils/ApiError.js")
const User = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const crypto = require("crypto");

const generateHtmlTemplate =(verificationUrl, emailType)=>{ return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>
                ${emailType === "VERIFY"
                    ? "Verify your Email"
                    : "Reset your Password"}
            </title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            font-family: Arial, Helvetica, sans-serif;
        ">

            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="background-color: #f3f4f6; padding: 40px 15px;"
            >
                <tr>
                    <td align="center">

                        <!-- Main Container -->
                        <table
                            width="600"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                max-width: 600px;
                                width: 100%;
                                background-color: #ffffff;
                                border-radius: 10px;
                                overflow: hidden;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                            "
                        >

                            <!-- Header -->
                            <tr>
                                <td style="
                                    background-color: #111827;
                                    padding: 25px;
                                    text-align: center;
                                ">
                                    <h1 style="
                                        margin: 0;
                                        color: #ffffff;
                                        font-size: 26px;
                                        font-weight: 700;
                                    ">
                                        XtremeChai
                                    </h1>
                                </td>
                            </tr>


                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px;">

                                    ${
                                        emailType === "VERIFY"
                                        ? `
                                            <h2 style="
                                                margin: 0 0 20px 0;
                                                color: #111827;
                                                font-size: 24px;
                                            ">
                                                Verify your email address
                                            </h2>

                                            <p style="
                                                margin: 0 0 20px 0;
                                                color: #4b5563;
                                                font-size: 16px;
                                                line-height: 1.6;
                                            ">
                                                Thanks for creating an account with
                                                <strong>XtremeChai</strong>.
                                                Please click the button below to
                                                verify your email address.
                                            </p>

                                            <!-- Verify Button -->
                                            <div style="
                                                text-align: center;
                                                margin: 30px 0;
                                            ">
                                                <a
                                                    href="${verificationUrl}"
                                                    style="
                                                        display: inline-block;
                                                        padding: 14px 30px;
                                                        background-color: #111827;
                                                        color: #ffffff;
                                                        text-decoration: none;
                                                        border-radius: 6px;
                                                        font-size: 16px;
                                                        font-weight: bold;
                                                    "
                                                >
                                                    Verify Email
                                                </a>
                                            </div>

                                            <p style="
                                                margin: 25px 0 10px 0;
                                                color: #6b7280;
                                                font-size: 14px;
                                                line-height: 1.5;
                                            ">
                                                This verification link will expire
                                                in approximately 6 minutes.
                                            </p>

                                            <p style="
                                                margin: 15px 0 0 0;
                                                color: #6b7280;
                                                font-size: 14px;
                                                line-height: 1.5;
                                            ">
                                                If the button doesn't work, copy and
                                                paste the following link into your
                                                browser:
                                            </p>

                                            <p style="
                                                margin: 10px 0 0 0;
                                                font-size: 13px;
                                                line-height: 1.5;
                                                word-break: break-all;
                                            ">
                                                <a
                                                    href="${verificationUrl}"
                                                    style="
                                                        color: #2563eb;
                                                        text-decoration: underline;
                                                    "
                                                >
                                                    ${verificationUrl}
                                                </a>
                                            </p>
                                        `
                                        : `
                                            <h2 style="
                                                margin: 0 0 20px 0;
                                                color: #111827;
                                                font-size: 24px;
                                            ">
                                                Reset your password
                                            </h2>

                                            <p style="
                                                margin: 0 0 20px 0;
                                                color: #4b5563;
                                                font-size: 16px;
                                                line-height: 1.6;
                                            ">
                                                We received a request to reset the
                                                password for your XtremeChai account.
                                                Click the button below to continue.
                                            </p>

                                            <!-- Reset Button -->
                                            <div style="
                                                text-align: center;
                                                margin: 30px 0;
                                            ">
                                                <a
                                                    href="${verificationUrl}"
                                                    style="
                                                        display: inline-block;
                                                        padding: 14px 30px;
                                                        background-color: #111827;
                                                        color: #ffffff;
                                                        text-decoration: none;
                                                        border-radius: 6px;
                                                        font-size: 16px;
                                                        font-weight: bold;
                                                    "
                                                >
                                                    Reset Password
                                                </a>
                                            </div>

                                            <p style="
                                                margin: 25px 0 0 0;
                                                color: #6b7280;
                                                font-size: 14px;
                                                line-height: 1.5;
                                            ">
                                                This password reset link will expire
                                                in approximately 6 minutes.
                                            </p>

                                            <p style="
                                                margin: 15px 0 0 0;
                                                color: #6b7280;
                                                font-size: 14px;
                                                line-height: 1.5;
                                            ">
                                                If you did not request a password
                                                reset, you can safely ignore this email.
                                            </p>
                                        `
                                    }

                                </td>
                            </tr>


                            <!-- Footer -->
                            <tr>
                                <td style="
                                    padding: 20px 40px;
                                    background-color: #f9fafb;
                                    text-align: center;
                                ">
                                    <p style="
                                        margin: 0;
                                        color: #9ca3af;
                                        font-size: 12px;
                                        line-height: 1.5;
                                    ">
                                        This is an automated email.
                                        Please do not reply to this message.
                                    </p>

                                    <p style="
                                        margin: 8px 0 0 0;
                                        color: #9ca3af;
                                        font-size: 12px;
                                    ">
                                        © ${new Date().getFullYear()} XtremeChai.
                                        All rights reserved.
                                    </p>
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
    `;
};


const sendUserVerificationMail = async ({email, emailType, userId})=>{
    const token = crypto.randomUUID().toString();
    const verificationUrl = `http://localhost:8000/api/auth/verify/${token}`
    if(emailType === "VERIFY"){
        await User.findByIdAndUpdate(userId,
            {
                verifyToken: token,
                verifyTokenExpiry: Date.now()+360000 // valid for six minutes
            }
        )
    }
    else if(emailType === "RESET"){
        await User.findByIdAndUpdate(userId,
            {
                forgotPasswordToken: token,
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
        console.log("Nodemailer Transporter Verified");

        const mailOptions = {
            from:"xtremechai@gmail.com",
            to:email,
            subject:(emailType==="VERIFY")?"Verify your email":"Reset your password",
            text:"",
            html:generateHtmlTemplate(verificationUrl, emailType),
        }

        return await transporter.sendMail(mailOptions);
    }
    catch(error){
        console.log("Error sending mail: ", error);
        throw new ApiError(400, "Error sending mail");
    }
}

module.exports = {
    sendUserVerificationMail
}