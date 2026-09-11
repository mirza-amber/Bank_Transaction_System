const { ApiError } = require("../utils/ApiError.js");
const { asyncHandler } = require("../utils/asyncHandler.js")
const {jwt} = require("jsonwebtoken") 
const User = require("../models/user.model.js")

const cookieverification = asyncHandler(async (req, res, next)=>{
    const accessToken = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!accessToken) throw new ApiError(401, "Unauthorized Access!")
    
    const decoded_token = jwt.verify(accessToken, process.env.JWT_ACCESSTOKEN_SECRET)

    if(!decoded_token) throw new ApiError("Unauthorized Access!");

    const user = await User.findById(decoded_token?._id)

    if(!user) throw new ApiError(401, "Invalid Access")

    req.user = user;
    next();
})

module.exports = {
    cookieverification
}