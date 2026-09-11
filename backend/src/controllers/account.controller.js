const Account = require("../models/account.model.js")
const { ApiError } = require("../utils/ApiError.js")
const { ApiResponse } = require("../utils/ApiResponse.js")
const { asyncHandler } = require("../utils/asyncHandler.js")

const createAccountController = asyncHandler(async (req,res)=>{
    const user = req.user

    const account = await Account.create({
        user: user._id,
    })

    const createdAccount = await Account.findById(account?._id)

    if(!createdAccount) throw new ApiError(400, "Account creation failed")

    return res.status(200).json(new ApiResponse(200, createdAccount, "User Account Created"))
})

module.exports = {
    createAccountController
}