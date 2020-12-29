import express from "express";
import User from "../../models/user.js";


const router = express.Router();


router.post('/', function (req, res, next) {
    console.log( req.body)

    User.createUser("sina","nos286@gmail.com","123123123").then((user)=>{
        res.send(user)
    })
}, function (req, res, nex) {

});

export default router;