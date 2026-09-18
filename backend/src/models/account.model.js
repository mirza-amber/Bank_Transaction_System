const mongoose = require("mongoose")
const Ledger = require("./ledger.model.js")

const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Account must be associated with a User"],
        index: true
    },
    status:{
        type: String,
        enum:{
            values:["ACTIVE", "FROZEN", "CLOSED"],
            message :"Account status can be Active, frozen or Closed"
        },
        default: "ACTIVE"
    },
    currency:{
        type: String,
        required: [true, "Currency is required"],
        default: "INR"
    },
},{
    timestamps: true,
    /*
     * These 2 steps will auto-create collections soon after connection with database is established.
     * autoIndex: false,
     * autoCreate: false
    */
})

accountSchema.index({user:1, status:1})

accountSchema.methods.getBalance = async function (){
    const balanceData = await Ledger.aggregate([

        {
            $match:{
                accountReference: this._id
            }
        },
        {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[ {$eq:["$type", "DEBIT"]} , "$amount", 0]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[ {$eq:["$type", "CREDIT"]} , "$amount", 0]
                    }
                }
            }
        },
        {
            $project:{
                _id: 0,
                totalDebit:1,
                totalCredit:1,
                totalBalance: { $subtract:["$totalCredit", "$totalDebit"]}
            }
        }
    ])

    return balanceData?.[0]?.totalBalance ?? 0
}

const Account = mongoose.model("Account", accountSchema)

module.exports = Account