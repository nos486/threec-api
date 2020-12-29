import express from "express";
import User from "../../models/user.js";


const router = express.Router();


router.get('/', function (req, res, next) {
    res.send({})
});

export default router;