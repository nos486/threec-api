const express =require( "express");
const router = express.Router();
const {ROLE} = require("./../../db")
const Joi = require("joi");


const {captcha,authorize, validateRequest} = require("../../middleware");
const {userController} = require("../../controller");


// router.post('/',authenticateSchema,captcha.check,authenticate);
router.post('/',authenticate);
router.post('/refresh',refreshTokenSchema, refreshToken);
router.post('/revoke', authorize(), revokeTokenSchema, revokeToken);

module.exports = router


function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required().min(4).max(20),
        password: Joi.string().required(),
        captchaKey : Joi.string().required().uuid(),
        captcha : Joi.string().required().length(4),
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    const { username, password } = req.body;
    const ipAddress = req.ip;
    userController.authenticate({ username, password, ipAddress })
        .then(({ ...user }) => {
            res.json(user);
        })
        .catch(next);
}

function refreshTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function refreshToken(req, res, next) {
    const {token} = req.body;
    const ipAddress = req.ip;
    userController.refreshToken({ token, ipAddress })
        .then(({ ...user }) => {
            res.json(user);
        })
        .catch(next);
}

function revokeTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
    // accept token from request body or cookie
    const {token} = req.body

    if (!token) return res.status(400).json({ message: 'Token is required' });

    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.user.ownsToken(token) && req.user.role !== ROLE.ADMIN) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    userController.deleteRefreshToken(token)
        .then(() => res.json({ message: 'Token revoked' }))
        .catch(next);
}

