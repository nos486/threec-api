const config = require("./../config")
const db = require('./../db')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    newMessage,
}

async function newMessage({userId,chatId,replyTo,text,textHash}){
    let message = new db.Message({
        author : userId,
        chat : chatId,
        type : db.MESSAGE_TYPE.TEXT,
        replyTo : replyTo,
        text : text,
        textHash : textHash
    })

    return await message.save()
}