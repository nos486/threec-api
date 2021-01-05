const Joi = require("joi")

module.exports = {
    messageSchema : Joi.object({
        chat: Joi.string().required().length(24),
        text: Joi.string().required().max(10000),
        hash: Joi.string().required().max(64),
        type: Joi.string().max(20),
        reply: Joi.string().length(24),
        fileName: Joi.string().max(64),
        fileHash: Joi.string().max(64),
        fileType: Joi.string().max(64),
        fileSize: Joi.number(),
    })
}



