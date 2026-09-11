const express = require("express");
const {cookieVerification} = require("../middlewares/cookieVerification.middleware.js"); 
const { createAccountController } = require("../controllers/account.controller.js");

const router = express.Router();

router.route("/create").post(cookieVerification, createAccountController)

module.exports = router