const mongoose =require( 'mongoose');
const md5 =require( "md5")
const jwt =require( "jsonwebtoken");
const config =require( "../config");
const bcrypt = require("bcrypt");
const {ROLE} = require("./enums")


/**
 * @typedef DBResult
 * @type {Object}
 * @property {error|success} type
 * @property {string} text
 * @property {Object} data
 */

const schema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email :{
            type : String,
            unique : true,
        },
        isEmailValid :{
            type:Boolean,
            default : false
        },
        areaCode :{
            type:Number
        },
        phoneNumber :{
            type : String,
            unique : true,
            sparse: true,
        },
        isPhoneNumberValid :{
            type:Boolean,
            default : false
        },
        password :{
            type : String,
            required: true,
        },
        role: {
            type: String,
            default : ROLE.USER,
            required: true
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        about :{
            type : String,
        }
    },
    { timestamps: true },
);

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.updatedAt
        delete ret.password;
    }
});

const User = mongoose.model('User', schema);


User.getUserById  = async function(id, fullDetails = false) {
    if (! mongoose.Types.ObjectId.isValid(id)) throw 'User not found';
    const user = await User.findById(id);
    if (!user) throw 'User not found';
    return fullDetails ? user : basicDetails(user);
}

User.getUserByUsername  = async function(username, fullDetails = false) {
    const user = await User.findOne({username});
    if (!user) throw 'User not found';
    return fullDetails ? user : basicDetails(user);
}

User.hasUsername = async function(username){
    return !!(await User.findOne({username}))
}

User.hasEmail = async function(email){
    return !!(await User.findOne({email}))
}

User.getUserByEmail  = async function(email, fullDetails = false) {
    const user = await User.findOne({email});
    if (!user) throw 'User not found';
    return fullDetails ? user : basicDetails(user);
}


//helpers

function basicDetails(user) {
    const { id, email, username, role } = user;
    return { id, email, username, role };
}

module.exports = User;