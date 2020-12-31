const express =require( "express");
const {captcha} =require("./../middleware")
const account =require( "./account");

const router = express.Router();

router.use("/account",account)
router.use("/captcha",captcha.generate)

module.exports = router