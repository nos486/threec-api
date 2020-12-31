const express = require("express");
const {createUser} =require ("./../../controller/user");


const router = express.Router();


router.get('/', function (req, res, next) {
    console.log( req.body)

    createUser("sina1","nos4228@gmail.com","123123123").then((user)=>{
        res.send(user)
    })
}, function (req, res, nex) {

});

module.exports = router;