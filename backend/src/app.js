const express = require("express");
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express();

// if the content-type does not match the middleware requirement, it is skipped
app.use(express.json({limit:"16kb"}))            // Only handles when content type is set to "application/json", otherwise skipped
app.use(express.urlencoded({ extended: true })); // for reading application/x-www-form-urlencoded

const corsOptions = {
    origin: "*",
    credentials: false
}
app.use(cors()); 

app.use(cookieParser())
/**
 * - User routes
 */
const authRouter = require("./routes/auth.routes.js")
app.use("/api/auth", authRouter)

/**
 * - Account routes
 */
const accoutRouter = require("./routes/account.routes.js");
app.use("/api/account", accoutRouter)

module.exports = app