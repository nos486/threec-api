const mongoose = require('mongoose');
const {MESSAGE_TYPE} = require("./enums")

const schema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        chat :{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Chat"
        },
        reply :{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        },
        text: {
            type: String,
        },
        hash: {
            type: String,
            maxlength : 128
        },
        file :{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        isDeleted : {
            type : Boolean,
            default : false
        }

    },
    { timestamps: true },
);

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret.updatedAt
        delete ret._id
    }
});

const Message = mongoose.model('Message', schema);

module.exports = Message;