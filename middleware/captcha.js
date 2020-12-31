const cache =require( "memory-cache");
const { v4: uuid } = require('uuid');
const svgCaptcha =require( "svg-captcha");

module.exports = {
    check,
    generate
}

function generate(req,res,next){
    let captcha = svgCaptcha.create({noise:2})
    let key = uuid()

    cache.put(key,captcha.text,60*1000)

    res.type('svg');
    res.status(200)
    res.append("Key",key)
    res.send(captcha.data)
}

function check(req,res,next) {
    let v = cache.get(req.body.captchaKey)
    if (v !== null){
        if(v.toLowerCase() === req.body.captcha.toLowerCase()){
            cache.del(req.body.captchaKey)
            next()
        }else {
            throw "Wrong captcha"
        }
    }else {
        throw "Wrong captcha"
    }
}

