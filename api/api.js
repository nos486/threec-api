import express from "express";
import captcha from "./captcha.js";
import login from "./account/login.js";
import register from "./account/register.js";
import profile from "./account/profile.js";

const router = express.Router();

router.use("/account/login",login)
router.use("/account/register",register)
router.use("/account/profile",profile)
router.use("/captcha",captcha)

export default router