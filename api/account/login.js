import express from "express";
import User from "./../../models/user.js";
import cache from "memory-cache";
import captcha from "../captcha.js";


const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    // res.send('login page');
    console.log(req.query);
    cache.put("name", "sina", 10000);
    User.findUser().then((user) => {
        res.send(user);
    });
});

router.post('/', function (req, res, next) {
    /**
     *
     * @type {{username,password,captcha_key,captcha_value}}
     */
    let data = req.body
    console.log()


    if(captcha.check(data.captcha_key,data.captcha_value)){
        User.checkUserByUsername(data.username,data.password).then((result) => {
            if(result.type === "success"){
                res.send({type:"success",token: User.getTokenByUserID(result.data._id)})
            }else {
                res.send(result)
            }
        });

    }else {
        res.send({type:"error",text:"wrong captcha."})
    }


}, function (req, res, nex) {

});

export default router;