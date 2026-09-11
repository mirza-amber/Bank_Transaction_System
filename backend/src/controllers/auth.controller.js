const User = require("../models/user.model.js")
const {ApiError} = require("../utils/ApiError.js")
const {ApiResponse} = require("../utils/ApiResponse.js")
const {asyncHandler} = require("../utils/asyncHandler.js")
const { sendUserVerificationMail } = require("../services/email.service.js")

/**
 * - User Registration Controller
 * - POST @ /api/auth/register
 */



const userRegistrationController = asyncHandler(async (req, res)=>{
    const {email, password, name}= req.body;

    const searchExistingUser = await User.findOne({
        email
    })

    if(searchExistingUser) throw new ApiError(409, "User already Exists!")

    const user = await User.create(
        {
            email,
            password,
            name
        }
    )

    const createdUser = await User.findById(user._id).select("")

    if (!createdUser) throw new ApiError(400, "Unable to register user!");
    
    res.status(200).json(new ApiResponse(200, createdUser, "User Registration Successful"))

    // If the mail is not sent due to some issue, the user will still be created, so we need to add another option in verify to resend email.
    const mailreturn = await sendUserVerificationMail({
        email, 
        emailType:"VERIFY",
        userId:user._id
    })

    // console.log(mailreturn)

    return ;
})

const generateUserAccessandRefreshToken = async (user)=>{
    try{
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        
        return {accessToken, refreshToken}
    }catch(error){
        throw new ApiError(500, "Token Generation failed");
    }

}

const userVerification = asyncHandler(async (req, res)=>{
    const {token} = req.params
    const user = await User.findOne({
        verifyToken: token,
        verifyTokenExpiry: { $gt: Date.now() }
    });

    if(!user) throw new ApiError(400, "Invalid or Expired Token")
    
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    res.status(200).json(new ApiResponse(200, user, "User Verified"));
}
)

const userLoginController = asyncHandler(async (req, res)=>{
    const{email , password} = req.body

    const user = await User.findOne({email}).select("+password")

    if(!user) throw new ApiError(404, "User does not exist!")

    const correctPassword = await user.comparePassword(password)

    if(!correctPassword) throw new ApiError(400, "Incorrect Password")
    
    const {accessToken, refreshToken} = await generateUserAccessandRefreshToken(user)

    if(!accessToken || !refreshToken) throw new ApiError(500, "");

    const options = {
        httpOnly: true,
        secure: true
    }

    const { password: _, ...userResponse } = user.toObject(); //removing password for response
    

    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, {userResponse, accessToken, refreshToken} ,"User logged in Successfully")
    )
})

module.exports = {
    userRegistrationController,
    userLoginController,
    userVerification
}