const express = require("express");
const {userRegistration} = require("../controllers/auth.controller.js")

const router = express.Router()

router.route("/register").get((req, res)=> {res.status(200).send("Registration Route")}).post(userRegistration)

module.exports = router