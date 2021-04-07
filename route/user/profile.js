const express = require("express");
const Joi = require("joi");
const path = require("path");
const {validateRequest,captcha,authorize} = require("../../middleware");
const {userController} = require("./../../controller")
const {ROLE} = require("./../../models")
const router = express.Router();

router.get('/:username', authorize() ,getById);

module.exports =  router;

function getById(req, res, next) {
    // regular users can get their own record and admins can get any record
    // if (req.params.username !== req.user.username) {
    //     return res.status(403).json({ message: 'Forbidden' });
    // }
    let fullDetail = req.params.username === req.user.username || req.user.role === ROLE.ADMIN
    userController.getUserByUsername(req.params.username,fullDetail).then((user) =>{
        res.json(user)
    }).catch(next);
}


//helpers
function basicDetails(user) {
    const { id, email, username, role } = user;
    return { id, email, username, role };
}
