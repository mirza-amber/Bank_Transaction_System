const express = require("express");
const { cookieVerification } = require("../middlewares/cookieVerification.middleware.js");
const { createTransaction } = require("../controllers/transaction.controller.js");
const multer = require("multer")

const router = express.Router();
const upload = multer()

router.route("/createtransaction").post(cookieVerification, upload.none(), createTransaction)

module.exports = router