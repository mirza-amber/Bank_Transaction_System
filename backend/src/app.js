const express = require("express");
const authRouter = require("./routes/auth.routes.js")
const cors = require("cors")

const app = express();
app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({ extended: true })); // for reading multipart/form-data, can also use multer


const corsOptions = {
    origin: "*",
    credentials: false
}
app.use(cors()); 


app.use("/api/auth", authRouter)

module.exports = app