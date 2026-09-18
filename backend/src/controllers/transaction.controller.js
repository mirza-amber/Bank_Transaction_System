const mongoose = require("mongoose")
const Transaction = require("../models/transaction.model.js")
const Account = require("../models/account.model.js")
const Ledger = require("../models/ledger.model.js")
const User = require("../models/user.model.js")
const {ApiError} = require("../utils/ApiError.js")
const {ApiResponse} = require("../utils/ApiResponse.js")
const {asyncHandler} = require("../utils/asyncHandler.js")
const { sendTransactionCompletionMail } = require("../services/email.service.js")



const createTransaction = asyncHandler(async (req, res)=>{
    const {fromAccount, toAccount, idempotencyKey, amount} = req.body;

    /**
     * - Check Details
    */

    if (!fromAccount || !toAccount || !idempotencyKey || amount == null) throw new ApiError(400, "Cannot create Transaction due to insufficient details")

    if (amount <= 0) throw new ApiError(400, "Transaction Amount should be greater than 0")

    const [fromUserAccount, toUserAccount] = await Promise.all([
        Account.findById(fromAccount), 
        Account.findById(toAccount)
    ]);

    if(!(fromUserAccount && toUserAccount)) throw new ApiError(400, "Invalid Account Details!")

    if( !fromUserAccount.user.equals(req.user._id) ) throw new ApiError(403, "Unauthorized Access!")

    /**
     * - Validate Idempotency Key
    */

    const ifTransactionAlreadyExists = await Transaction.findOne({idempotencyKey})

    if(ifTransactionAlreadyExists) {
        if(ifTransactionAlreadyExists.status === "COMPLETED") return res.status(200).json(new ApiResponse(200, ifTransactionAlreadyExists, "Transaction Already Completed"))
        else if(ifTransactionAlreadyExists.status === "PENDING") return res.status(200).json(new ApiResponse(200, {}, "Transaction still processing"))
        else if(ifTransactionAlreadyExists.status === "FAILED") return res.status(200).json(new ApiResponse(200, {}, "Transaction failed"))
        else if(ifTransactionAlreadyExists.status === "REVERSED") return res.status(200).json(new ApiResponse(200, {}, "Transaction Reverse, Kindly Try again!"))
    }

    /**
     * - Check Account Status
    */

    if(!(fromUserAccount.status==="ACTIVE"))  throw new ApiError(400, "Inactive Sender Account");
    if(!(toUserAccount.status==="ACTIVE")) throw new ApiError(400, "Inactive Receiver Account");
    

    /**
     * - Derive Sender balance from Ledger
    */
   const senderBalance = await fromUserAccount.getBalance()
   if(senderBalance < amount) throw new ApiError(400, "Insufficient Balance");

    /**
     * - Creating Session
    */

    const session = await mongoose.startSession()

try{
    session.startTransaction()

    const transaction = await Transaction.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey
    }, {session})

    const debitLedgerEntry = await Ledger.create({
        accountReference:fromAccount,
        amount,
        transaction:transaction._id,
        type: "DEBIT"

    }, {session})

    const creditLedgerEntry = await Ledger.create({
        accountReference:toAccount,
        amount,
        transaction:transaction._id,
        type: "CREDIT"

    }, {session})

    transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
}
catch(error){

    await session.abortTransaction();
    if (error.code === 11000){
        const existingTransaction = await Transaction.findOne({idempotencyKey})

        return res.status(200).json(new ApiResponse(200, existingTransaction, "Transaction already exists"))
    }
    throw new ApiError(error.code, "Error completing transaction! Money has not been debited or credited")
}
finally {
    await session.endSession();
}

    /**
     * - Send Email to inform User about completed Transaction 
    */

    sendTransactionCompletionMail(userEmail, transactionDocument)

    return res.status(200).json(new ApiResponse(200, transaction, "Transaction Completed"))
})


 
module.exports = {createTransaction}