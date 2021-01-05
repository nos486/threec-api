const config = require("./../config")
const models = require('./../models')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    getUserChats,
}

async function getUserChats(userId){
    return await models.Chat.getUserChatsById(userId)
}