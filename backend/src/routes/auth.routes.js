const express = require("express");
const {userRegistrationController, userLoginController} = require("../controllers/auth.controller.js")
const multer = require("multer")

const router = express.Router()
const upload = multer()

router.route("/register").get((req, res)=> {res.status(200).send("Registration Route")}).post(upload.none(), userRegistrationController)
router.route("/login").post(userLoginController)

module.exports = router