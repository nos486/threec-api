const express = require("express");
const Joi = require("joi");
const {validateRequest,captcha,authorize} = require("../../middleware");
const {userController} = require("./../../controller")
const {ROLE} = require("./../../db")
const router = express.Router();

router.get('/:username', authorize() ,getById);

module.exports =  router;

function getById(req, res, next) {
    // regular users can get their own record and admins can get any record
    if (req.params.username !== req.user.username) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    userController.getUserByUsername(req.params.username,req.user.role === ROLE.ADMIN)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(next);
}

