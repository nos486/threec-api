const config = require("./../config")
const models = require('./../models')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose =require( 'mongoose');

module.exports = {
    newMessage,
    getMessages,
    getMessageCheckUser,
    getMessage,
    deleteMessage
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

async function getMessages(userId,chatId){
    if(! await models.Chat.isUserHasChat(userId,chatId)) throw "Chat not find"
    let messages = await models.Message.find({chat:chatId}).populate('file').populate({ path:'reply',populate: {path: "file"}})
    return messages
}

async function getMessageCheckUser(userId,messageId){
    if(!models.isValidId(messageId)) throw "Id not valid"

    let message = await models.Message.findOne({_id:messageId}).populate('file')
    if(!message)  throw "Message not find"

    let chat = await models.Chat.findOne({_id:message.chat,users: userId})
    if(!chat)  throw "Chat not find"

    return message
}

async function getMessage(messageId){

    let message = await models.Message.findOne({_id:messageId}).populate('file').populate('reply');
    if(!message)  throw "Message not find"

    return message
}

async function deleteMessage(userId, messageId) {
    if (!models.isValidId(messageId)) throw "Id not valid";

    let message = await models.Message.findById(messageId).populate('file').populate('chat');
    if (!message) throw "Message not find";

    if (!(message.author.toString() === userId || message.chat.admin.toString() === userId)) throw "Permission denied";
    await message.remove();

    return message;
}

async function deleteMessageFile(userId,messageId){
    // let message = await models.Message.aggregate([{ $match: {_id: new mongoose.Types.ObjectId(messageId)}}]).lookup({ from: 'chats', localField: 'chat', foreignField: '_id', as: 'chat' }).match({ "chat.admin" : new mongoose.Types.ObjectId(userId) }).exec().cursor()

}





