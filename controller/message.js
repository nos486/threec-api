const config = require("./../config")
const models = require('./../models')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    newMessage,
    getMessages
}

async function newMessage({author,chat,reply,text,hash,file}){
    if(! await models.Chat.isUserHasChat(author,chat)) throw "Chat not find"
    let message = new models.Message({
        author,
        chat,
        reply,
        text,
        hash,
        file
    })

    return await message.save()
}

async function getMessages(userId,chat){
    if(! await models.Chat.isUserHasChat(userId,chat)) throw "Chat not find"
    let messages = await models.Message.find({chat}).populate('file')
    return messages
}

