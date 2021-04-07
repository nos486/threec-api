const express = require("express");
const Joi = require("joi");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const {validateRequest,captcha,authorize} = require("../../middleware");
const {userController} = require("./../../controller")
const {ROLE} = require("./../../models")
const router = express.Router();

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/avatars/')
    },
    filename: function (req, file, cb) {
        cb(null, req.user.id)
    }
});

const uploadController = multer({
    storage: storage,
    // dest: 'public/avatars/',
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG)$/)) {
            req.fileValidationError = 'Only jpeg files are allowed!';
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
    }
}).single('avatar')

router.get('/:id', authorize() ,getUserAvatarById);
router.post('/:id', authorize() ,setAvatar);

module.exports =  router;



function getUserAvatarById(req, res, next) {
    console.log(req.params)
    userController.getUserById(req.params.id).then((user) =>{

        let options = {
            root: path.join(""),
            headers: {'Content-Type': 'image/jpeg'}
        };

        let avatarPath =  "public/avatar.jpg"

        if (fs.existsSync(`./public/avatars/${req.params.id}`)) {
            avatarPath = `./public/avatars/${req.params.id}`
        }

        res.sendFile(avatarPath,options, function (err) {
            if (err) {
                next(err)
            }
        })

    }).catch(next);
}


function setAvatar(req, res, next){
    if (req.params.id !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    uploadController(req,res,function(err){
        if (err) {
            next(err)
        }else{
            console.log(req.file)
            res.json({})
        }
    });


}
