const express = require("express");
const Joi = require("joi");
const {userController} =require ("./../../controller");
const {authorize,captcha,validateRequest} =require ("./../../middleware");

const router = express.Router();


router.post('/',registerSchema,captcha.check, register);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required().min(4).max(20),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        captchaKey : Joi.string().required().uuid(),
        captcha : Joi.string().required().length(4),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    const {username, email, password} = req.body;
    userController.createUser(username, email, password).then((user) => {
        res.status(201).json({message : "Account created successfully",...user.toJSON()});
    }).catch(next);
}
