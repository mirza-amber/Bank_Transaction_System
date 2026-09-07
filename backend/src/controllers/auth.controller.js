const User = require("../models/user.model.js")
const {asyncHandler} = require("../utils/asyncHandler.js")

const userRegistration = asyncHandler(async (req, res)=>{
    const {email, password, naem}= req.body;
    
})

module.exports = {
    userRegistration
}