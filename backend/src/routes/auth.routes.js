const express = require("express");
const {userRegistrationController, userLoginController, userVerification} = require("../controllers/auth.controller.js")
const multer = require("multer")

const router = express.Router()
const upload = multer() //multer triggers only when data type is multipart/form-data otherwise skipped

router.route("/register").get((req, res)=> {res.status(200).send("Registration Route")}).post(upload.none(), userRegistrationController)
router.route("/login").post(userLoginController)
router.route("/verify/:token").get(userVerification)

module.exports = router