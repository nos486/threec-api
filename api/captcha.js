import express from "express";
import cache from "memory-cache";
import {v4 as uuid} from 'uuid';
import svgCaptcha from "svg-captcha";

const router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
    let captcha = svgCaptcha.create({noise:2})
    let key = uuid()

    cache.put(key,captcha.text,60*1000)

    res.type('svg');
    res.status(200)
    res.append("Key",key)
    res.send(captcha.data)

});

router.check = function (key, value) {
    let v = cache.get(key)

    if (v !== null){
        if(v.toLowerCase() === value.toLowerCase()){
            cache.del(key)
            return true
        }else {
            return false
        }
    }else {
        return false
    }
}

export default router