const mongoose =require( 'mongoose');
const md5 =require( "md5")
const jwt =require( "jsonwebtoken");
const config =require( "../config");
const bcrypt = require("bcrypt");
const {CHAT_TYPE,MESSAGE_TYPE} = require("./enums")


/**
 * @typedef DBResult
 * @type {Object}
 * @property {error|success} type
 * @property {string} text
 * @property {Object} data
 */

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        type :{
            type : String,
            default : CHAT_TYPE.PRIVATE
        },
        admin :{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        users  :[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
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

const Chat = mongoose.model('Chat', schema);


Chat.getUserChatsById  = async function(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw 'Not valid id';
    const chats = await Chat.find({users: userId});
    if (!chats) throw 'No chats';
    return chats;
}


module.exports = Chat;