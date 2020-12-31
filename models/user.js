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
        is_email_valid :{
            type:Boolean,
            default : false
        },
        phone_number :{
            type : String,
        },
        is_phone_number_valid :{
            type:Boolean,
            default : false
        },
        password :{
            type : String,
            required: true,
        },
        is_admin :{
            type:Boolean,
            default: false
        },
        role: {
            type: String,
            default : ROLE.USER,
            required: true
        },
        first_name: {
            type: String,
        },
        last_name: {
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
        delete ret.password;
    }
});

const User = mongoose.model('User', schema);



User.findUser  = async function(user){

    let users =await User.find(user).exec()

    if (users.length === 0){
        throw "User not find"
    }else if(users.length === 1){
        return users[0]
    }else {
        throw "Multiple user find"
    }

}

User.checkUser = async function(user, password){
    return  User.findUser(user).then((result)=>{
        if(result.type === "success"){
            if(bcrypt.compareSync(password, result.data.password)){
                return result
            }else {
                throw "Wrong password"
            }
        }else {
            throw "User not find"
        }
    })
}

User.findUserByUsername  = async function(username){
    return await User.findUser({username :  username})
}

/**
 *
 * @param email
 * @returns {Promise<DBResult>}
 */
User.findUserByEmail  = async function(email){
    return await User.findUser({email :  email})
}

User.getTokenByUserID  = function(userId){
    return jwt.sign({id:userId}, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    });
}

/**
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<boolean>}
 */
User.checkUserByUsername  = async function(username, password){
    return await User.checkUser({username :  username},password)
}

module.exports = User;