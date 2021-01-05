const config = require("./../config")
const db = require('./../db')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    newMessage,
    getMessages
}

async function newMessage({author,chatId,replyTo,text,textHash}){
    let message = new db.Message({
        author,
        chatId,
        type : db.MESSAGE_TYPE.TEXT,
        replyTo,
        text,
        textHash
    })

    return await message.save()
}

async function getMessages(userId,chatId){
    if(! await db.Chat.isUserHasChat(userId,chatId)) throw "Chat not find"
    let messages = await db.Message.find({chatId})
    return messages
}

