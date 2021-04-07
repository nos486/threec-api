const express =require( "express");
const {authorize} = require("../../middleware");
const {Chat,CHAT_TYPE,User} = require("./../../models")
const {userController} = require("../../controller");

const router = express.Router();

const token =require( "./token");
const register =require( "./register");
const profile =require( "./profile");
const avatar = require("./avatar")
const path = require("path");
const {ROLE} = require("../../models/enums");

// router.get('/', authorize(ROLE.ADMIN), getAll);
router.get('/', authorize(),getOwnUser);
router.get('/:username',authorize(), getUserProfileByUsername);
router.use('/avatar',avatar);
router.use("/token",token)
router.use("/register",register)
router.use("/profile",profile)

module.exports = router


function getAll(req, res, next) {
    userController.getAll()
        .then(users => res.json(users))
        .catch(next);
}

async function getOwnUser(req, res, next) {
    userController.getUserByUsername(req.user.username,true)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(next);
}

function getUserProfileByUsername(req, res, next) {
    userController.getUserByUsername(req.params.username).then((user) =>{
        if(req.params.username === req.user.username || req.user.role === ROLE.ADMIN){
            res.json(user)
        }else {
            res.json(basicDetails(user))
        }
    }).catch(next);
}



//helpers
function basicDetails(user) {
    const { id, email, username, role } = user;
    return { id, email, username, role };
}