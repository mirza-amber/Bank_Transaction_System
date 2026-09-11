const express = require("express");
const authRouter = require("./routes/auth.routes.js")
const cors = require("cors")

const app = express();

// if the content-type does not match the middleware requirement, it is skipped
app.use(express.json({limit:"16kb"}))            // Only handles when content type is set to "application/json", otherwise skipped
app.use(express.urlencoded({ extended: true })); // for reading application/x-www-form-urlencoded

const corsOptions = {
    origin: "*",
    credentials: false
}
app.use(cors()); 


app.use("/api/auth", authRouter)

module.exports = app