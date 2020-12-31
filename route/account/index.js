const express =require( "express");
const router = express.Router();

const login =require( "./login.js");
const register =require( "./register.js");
const profile =require( "./profile.js");

router.use("/login",login)
router.use("/register",register)
router.use("/profile",profile)

module.exports = router