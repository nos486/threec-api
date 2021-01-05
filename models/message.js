const mongoose = require('mongoose');
const {MESSAGE_TYPE} = require("./enums")

const schema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        chatId :{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Chat"
        },
        replyTo :{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        },
        type :{
            type: String,
            default : MESSAGE_TYPE.TEXT,
            maxlength : 64
        },
        text: {
            type: String,
        },
        textHash: {
            type: String,
            maxlength : 128
        },
        content : {
            type: String,
        },
        contentName  : {
            type: String,
            maxlength : 64
        },
        contentType  : {
            type: String,
            maxlength : 64
        },
        contentSize  : {
            type: Number,
            maxlength : 20
        },

    },
    { timestamps: true },
);

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret.updatedAt
    }
});

const Message = mongoose.model('Message', schema);

module.exports = Message;