const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
        index: true
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true,"Required a to Account"],
        index: true
    },
    status:{
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        default: "PENDING"
    },
    amount:{
        type: Number,
        required: true,
        min: [0, "Amount cannot be negative"]
    },
    idempotencyKey:{
        type: String,
        required: [true,"Required for creating a transaction"],
        index: true,
        unique: true
    }
},
{timestamps: true})


const Transaction = mongoose.model("Transaction", transactionSchema)

module.exports = Transaction