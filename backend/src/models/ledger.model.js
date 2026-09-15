const mongoose = require("moongose")
const { ApiError } = require("../utils/ApiError.js")

const ledgerSchema = new mongoose.Schema({
    accountReference:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Ledger must be associated with an account"],
        index: true,
        immutable: true
    },
    amount:{
        type: Number,
        required: [true, "Amount is required for a Ledger entry"],
        immutable: true
    },
    transaction:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Transaction",
        required: [true, "Ledger must be assciated with a Transaction"],
        index: true,
        immutable: true
    },
    type:{
        type: String,
        enum:["Credit", "Debit"],
        required: true,
        immutable: true
    }

},
{timestamps: true})

const preventLedgerModification = function (){
    throw new ApiError(400, "Ledger modification is not allowed")
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);

const Ledger = mongoose.model("Ledger", ledgerSchema)

module.exports = Ledger