const {secret} = require("./../config")
const models = require('./../models')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {randomString} = require("../helper/utils");

module.exports = {
    createUser,
    authenticate,
    refreshToken,
    deleteRefreshToken,
    getAll,
    getUserById,
    getUserByUsername
}

async function createUser(username, email, password){
    username = username.toLowerCase()

    if (await models.User.hasUsername(username)){
        throw "Username exist"
    }

    if (await models.User.hasEmail(email)){
        throw "Email exist"
    }

    let user = new models.User({
        username: username,
        email : email,
        password : bcrypt.hashSync(password, 10),
    });

    await user.save();
    return user
}

async function authenticate({ username, password, ipAddress }) {
    username = username.toLowerCase()

    const user = await models.User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        throw 'Username or password is incorrect';
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(user);

    await models.RefreshToken.findOneAndDelete({user: user.id})
    const refreshToken = generateRefreshToken(user, ipAddress);
    await refreshToken.save();

    return {
        ...user.toJSON(),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await models.RefreshToken.getRefreshTokenByToken(token);
    const { user } = refreshToken;

    await models.RefreshToken.findOneAndDelete({user: user.id})
    const newRefreshToken = generateRefreshToken(user, ipAddress);
    await newRefreshToken.save();

    const newJwtToken = generateJwtToken(user);

    // return basic details and tokens
    return {
        ...user.toJSON(),
        jwtToken : newJwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function deleteRefreshToken(token) {
    const refreshToken = await models.RefreshToken.getRefreshTokenByToken(token)
    refreshToken.delete()
}

async function getAll() {
    const users = await models.User.find();
    return users;
}

// helper functions


function generateJwtToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes
    //todo change expiresIn
    return jwt.sign({ id: user.id }, secret, { expiresIn: '15d' });
}

function generateRefreshToken(user, ipAddress) {
    // create a refresh token that expires in 7 days
    return new models.RefreshToken({
        user: user.id,
        token: randomString(40),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createmodelsyIp: ipAddress
    });
}


async function getUserById(userId,fullDetails = false) {
    return await models.User.getUserById(userId,fullDetails);
}


async function getUserByUsername(username,fullDetails = false) {
    username = username.toLowerCase()
    return await models.User.getUserByUsername(username,fullDetails);
}

