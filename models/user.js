import mongoose from 'mongoose';
import md5 from "md5"
import jwt from "jsonwebtoken";
import config from "../config.js";


/**
 * @typedef DBResult
 * @type {Object}
 * @property {error|success} type
 * @property {string} text
 * @property {Object} data
 */

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email :{
            type : String,
            unique : true,
            sparse: true,
            required: true,
        },
        is_email_valid :{
            type:Boolean,
            default : false
        },
        phone_number :{
            type : String,
            unique : true,
            sparse: true,
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
            default : false
        },
        first_name :{
            type : String,
        },
        last_name :{
            type : String,
        },
        about :{
            type : String,
        }
    },
    { timestamps: true },
);

userSchema.methods.findByLogin = async function (login) {
    let user = await this.findOne({
        username: login,
    });

    if (!user) {
        user = await this.findOne({ email: login });
    }
    return user;
};

const User = mongoose.model('User', userSchema);

User.createUser = async function(username,email,password){
    if ((await User.findUserByUsername(username)).type === "success"){
        return {type:"error",text:"user exist"}
    }

    if ((await User.findUserByEmail(email)).type === "success"){
        return {type:"error",text:"user exist"}
    }

    let user = new User({
        username: username,
        email : email,
        password : md5(password),
        phone_number : null
    });

    await user.save();
    return {type:"success",data:user}

}

/**
 *
 * @param {Object} user
 * @returns {Promise<Object>}
 */
User.findUser  = async function(user){
    try {
        let users =await User.find(user).exec()
        if (users.length === 0){
            return {type:"error",text:"user not find",}
        }else if(users.length === 1){
            return {type:"success",data:users[0]}
        }else {
            return {type:"error",text:"multiple user find"}
        }
    }catch (err){
        return {type:"error",text:err}
    }
}

User.checkUser = async function(user,password){
    return  User.findUser(user).then((result)=>{
        if(result.type === "success"){
            if(result.data.password === md5(password)){
                return result
            }else {
                return {type:"error",text:"wrong password"}
            }
        }else {
            return {type:"error",text:"user not find"}
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
User.checkUserByUsername  = async function(username,password){
    return await User.checkUser({username :  username},password)
}


export default User;