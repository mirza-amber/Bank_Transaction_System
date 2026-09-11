const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler")

const cookieverification = asyncHandler(async (req, res, next)=>{
    const accessToken = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!accessToken) throw new ApiError(400, "Unauthorized Access!")
    
    
})

module.exports = {
    cookieverification
}