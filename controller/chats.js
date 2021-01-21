const config = require("./../config")
const models = require('./../models')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    createChat,
    isChatExist,
    getUserChats,
}

async function isChatExist(username){
    let chat = models.Chat.findOne({username})
    if (!chat) return false
    return chat
}

async function createChat({username,name,type,adminId=null}){
    // Object.keys(models.MESSAGE_TYPE).forEach((key)=>{
    //     console.log(key)
    // })

    let chatModel = {
        username,
        name,
        type,
    }
    if (adminId !== null) chatModel.admin = adminId

    let chat = new models.Chat(chatModel)
    await chat.save()

    return chat
}

async function getUserChats(userId){
    return await models.Chat.getUserChatsById(userId)
}