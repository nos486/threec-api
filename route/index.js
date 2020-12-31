const express =require( "express");
const {captcha} =require("./../middleware")
const user =require( "./user");

const router = express.Router();

router.use("/user",user)
router.use("/captcha",captcha.generate)

module.exports = router