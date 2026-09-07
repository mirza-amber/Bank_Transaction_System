const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required:[true, "Email is required"],
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email address"],
        unique: ["true", "email already in user"]
    },
    name:{
        type: String,
        required:[true, "Name is required"],
    },
    password:{
        type: String,
        required:[true, "Password is true"],
        minlength:[6, "Password too short"],
        select:false
    },
    refreshToken:{
        type:String,
        default:null,
        select:false
    }
}, {timestamps: true})

userSchema.pre("save", async function (req, res, next){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email
    },
    process.env.JWT_ACCESSTOKEN_SECRET,
    {
        expiresIn:"1d"
    }
    )
}
userSchema.methods.generateRefreshToken =  function (){
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email
    },
    process.env.JWT_REFRESHTOKEN_SECRET,
    {
        expiresIn:"10d"
    }
    )
}

const User = new mongoose.model("User", userSchema)

module.exports = User