const {messageController,fileController} = require("./../controller")
const {deleteMessageSchema} = require("./../helper/validateSchemas")
const Joi = require("joi")

function messageHandler(socket, next) {
    socket.on("getMessages",(query)=>{

        let {error, value} = validateGetMessagesQuery({...query});

        if (error) {
            next(error);
        }else {
            messageController.getMessages(socket.userId, value.chat).then((messages) => {
                socket.emit("newMessages", messages);
            });
        }
    })

    socket.on("newMessage", (message) => {
        let {error, value} = validateMessage({...message});

        if(error){
            next(error);
        }else {
            messageController.newMessage({author: socket.userId, ...value}).then((message) => {
                this.to(message.chat.toString()).emit("newMessages", [message]);
            });
        }
    });

    socket.on("deleteMessage", (messageId) => {
        let {error, value} = deleteMessageSchema.validate({messageId});

        if(error){
            next(error);
        }else {
            messageController.deleteMessage(socket.userId,messageId).then((message)=>{
                if(message.file) fileController.deleteFile(message.file._id).then((file)=>{
                    console.log(file)
                }).catch(next)

                this.to(message.chat._id.toString()).emit("deleteMessage", {id:message.id,chat:message.chat._id.toString()});
            }).catch(next)
        }
    });


    next()
}

function validateMessage(message) {
    let schema = Joi.object({
        chat: Joi.string().required(),
        text: Joi.string().required(),
        hash: Joi.string().required(),
        reply : Joi.string(),
    });

    return schema.validate(message)
}

function validateGetMessagesQuery(query) {

    let schema = Joi.object({
        chat: Joi.string().required(),
    });

    return schema.validate(query)
}

module.exports = messageHandler;