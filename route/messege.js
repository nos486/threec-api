const express = require("express");
const Joi = require("joi");
const multer = require("multer");
const {validateRequest,captcha,authorize} = require("../middleware");
const {userController} = require("./../controller")
const {ROLE} = require("./../models")
const router = express.Router();
const socket = require("./../socket")
const {messageController,fileController} = require("../controller/");
const {messageSchema} = require("./../helper/validateSchemas")

const uploadController = multer({ dest: 'uploads/' })


// router.get('/file', authorize() ,uploadController.single('content') ,upload);
router.post('/', authorize() ,uploadController.single('file') ,newMessageValidate,newMessage);

module.exports =  router;

function newMessageValidate(req, res, next) {
    validateRequest(req,next,messageSchema)
}


async function newMessage(req, res, next) {

    let jsonMessage = {author: req.user.id}
    if(req.file){
        var file =  await fileController.newFile({
            name: req.body.fileName,
            hash: req.body.fileHash,
            type: req.body.fileType,
            size: req.body.fileSize,
            path: req.file.path
        });

        jsonMessage.file = file._id
    }

    let message = await messageController.newMessage({...jsonMessage, ...req.body})

    if(req.file){
        message.file = file
    }
    socket.io.to(message.chat.toString()).emit("newMessages", [message]);

    res.send("ok")
}

