const express = require("express");
const authRouter = require("./routes/auth.routes.js")
const cors = require("cors")

const app = express();

app.use(express.json())

const corsOptions = {
    origin: "*",
    credentials: false
}
app.use(cors(corsOptions)); 

// app.use(cors())

app.use("/api/auth", authRouter)

module.exports = app