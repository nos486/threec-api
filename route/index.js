const express =require( "express");
const {captcha} =require("./../middleware")

const router = express.Router();

router.use("/user",require( "./user"))
router.use("/chat",require( "./chat"))
router.use("/message",require("./messege"))
router.use("/captcha",captcha.generate)

module.exports = router