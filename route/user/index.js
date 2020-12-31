const express =require( "express");
const {authorize} = require("../../middleware");
const {ROLE} = require("./../../db")
const {userController} = require("../../controller");

const router = express.Router();

const token =require( "./token");
const register =require( "./register");
const profile =require( "./profile");

router.get('/', authorize(ROLE.ADMIN), getAll);
router.use("/token",token)
router.use("/register",register)
router.use("/profile",profile)

module.exports = router


function getAll(req, res, next) {
    userController.getAll()
        .then(users => res.json(users))
        .catch(next);
}

