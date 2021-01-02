const express =require( "express");
const {authorize} = require("../../middleware");
const {Chat,CHAT_TYPE,User} = require("./../../db")
const {userController} = require("../../controller");

const router = express.Router();

const token =require( "./token");
const register =require( "./register");
const profile =require( "./profile");

// router.get('/', authorize(ROLE.ADMIN), getAll);
router.get('/', test);
router.use("/token",token)
router.use("/register",register)
router.use("/profile",profile)

module.exports = router


function getAll(req, res, next) {
    userController.getAll()
        .then(users => res.json(users))
        .catch(next);
}

async function test(req, res, next) {
    // let user = await User.getUserByUsername("Mina")
    // console.log(user)
    //
    // let chat = new Chat({
    //     name: "t2",
    //     type: CHAT_TYPE.PRIVATE,
    //     admin: null,
    //     users: []
    // })

    // await chat.save()

    Chat.getUserChatsById("").then((data)=>{
        console.log(data)
    })

    res.send("d")
}

