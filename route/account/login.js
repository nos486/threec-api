const express = require("express");
const cache = require("memory-cache");
const Joi = require("joi");
const {user} = require("./../../controller");
const {captcha, validateRequest, authorize} = require("./../../middleware");

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('login page');
    // console.log(req.query);
    // cache.put("name", "sina", 10000);
    // User.findUser().then((user) => {
    //     res.send(user);
    // });
});


router.post('/',authenticate);

module.exports =  router;


function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required().min(4).max(20),
        password: Joi.string().required(),
        captcha_key : Joi.string().required().uuid(),
        captcha : Joi.string().required().length(4),
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    const { username, password } = req.body;
    const ipAddress = req.ip;
    user.authenticate({ username, password, ipAddress })
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            console.log(user)
            res.json(user);
        })
        .catch(next);
}


// helper functions

function setTokenCookie(res, token)
{
    // create http only cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}