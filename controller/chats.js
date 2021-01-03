const config = require("./../config")
const db = require('./../db')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    getUserChats,
}

async function getUserChats(userId){
    return await db.Chat.getUserChatsById(userId)
}