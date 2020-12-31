const config = require("./../config")
const db = require('./../db')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {randomString} = require("../helper/utils");

module.exports = {
    createUser,
    authenticate,
    refreshToken,
    deleteRefreshToken,
    getAll,
}

async function createUser(username, email, password){
    if (await db.User.hasUsername(username)){
        throw "Username exist"
    }

    if (await db.User.hasEmail(email)){
        throw "Email exist"
    }

    let user = new db.User({
        username: username,
        email : email,
        password : bcrypt.hashSync(password, 10),
    });

    await user.save();
    return user
}

async function authenticate({ username, password, ipAddress }) {
    const user = await db.User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        throw 'Username or password is incorrect';
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(user);

    await db.RefreshToken.findOneAndDelete({user: user.id})
    const refreshToken = generateRefreshToken(user, ipAddress);
    await refreshToken.save();

    return {
        ...user.toJSON(),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await db.RefreshToken.getRefreshTokenByToken(token);
    const { user } = refreshToken;

    await db.RefreshToken.findOneAndDelete({user: user.id})
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
    const refreshToken = await db.RefreshToken.getRefreshTokenByToken(token)
    refreshToken.delete()
}

async function getAll() {
    const users = await db.User.find();
    return users.map(x => basicDetails(x));
}

// helper functions


function generateJwtToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign({ id: user.id }, config.secret, { expiresIn: '15m' });
}

function generateRefreshToken(user, ipAddress) {
    // create a refresh token that expires in 7 days
    return new db.RefreshToken({
        user: user.id,
        token: randomString(40),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });
}

