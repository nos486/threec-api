const {messageController} = require("./../controller")
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
                console.log(message.chat) //5ff0e405fedfca2378cfe089
                this.to(message.chat.toString()).emit("newMessages", [message]);
            });
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