const express = require("express");
const Joi = require("joi");
const multer = require("multer");
const {validateRequest,captcha,authorize} = require("../middleware");
const {userController} = require("./../controller")
const {ROLE} = require("./../models")
const router = express.Router();
const socket = require("./../socket")

const uploadController = multer({ dest: 'public/uploads/' })


// router.get('/file', authorize() ,uploadController.single('content') ,upload);
router.post('/message', authorize() ,uploadController.single('content') ,upload);

module.exports =  router;

function upload(req, res, next) {

    socket.io.emit('message', 'injiiiiiiiiiiiiiii')

    //{
    //   fieldname: 'content',
    //   originalname: 'w4qz9rtc42kjk7s7f4',
    //   encoding: '7bit',
    //   mimetype: 'aes-128',
    //   destination: 'uploads/',
    //   filename: 'b94ccd9cf262221aa04c2dead296db20',
    //   path: 'uploads\\b94ccd9cf262221aa04c2dead296db20',
    //   size: 6864
    // }
    console.log(req)

    res.send("ok")
}

