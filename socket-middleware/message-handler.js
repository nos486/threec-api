const {messageController} = require("./../controller")
const Joi = require("joi")

function chatHandler(socket, next) {
    socket.on("newMessage",(message)=>{
        let {error,value} = validateMessage(message)

        if(error){
            next(error)
        }else {
            messageController.newMessage({userId: socket.userId, ...value}).then((message)=>{
                socket.emit("newMessage",message)
            })
        }

    })
    next()
}

function validateMessage(message) {
    let schema = Joi.object({
        chatId: Joi.string().required(),
        text: Joi.string().required(),
        textHash: Joi.string().required(),
        replyTo : Joi.string(),
    });

    return schema.validate(message)
}

module.exports = chatHandler;