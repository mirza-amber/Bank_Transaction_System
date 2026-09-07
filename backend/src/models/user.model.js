const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

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
    }
}, {timestamps: true})

userSchema.pre("save", async function (req, res, next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

userSchema.methods.comparePassword = async function (password){
    await bcrypt.compare(password, this.password)
}

const User = new mongoose.model("User", userSchema)

module.exports = User