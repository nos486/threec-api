import express from "express";
import User from "../models/user.js";

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    // res.send('login page');
    console.log(req.query)
    User.findUser().then((user)=>{
        res.send(user);
    })

});

export default router