const config = require("./../config")
const db = require('./../db')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {randomString} = require("../helper/utils");

module.exports = {
    createUser,
    authenticate,
    refreshToken,
    revokeToken,
    getAll,
    getById,
    getRefreshTokens
}

async function createUser(username, email, password){
    if ((await db.User.findUserByUsername(username)).type === "success"){
        throw "Username exist"
    }

    if ((await db.User.findUserByEmail(email)).type === "success"){
        throw "Email exist"
    }

    let user = new db.User({
        username: username,
        email : email,
        password : bcrypt.hashSync(password, 10),
        phone_number : null
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
    const refreshToken = generateRefreshToken(user, ipAddress);
    console.log(jwtToken)
    // save refresh token
    await refreshToken.save();

    return {
        ...basicDetails(user),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const { user } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(user, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(user);

    // return basic details and tokens
    return {
        ...basicDetails(user),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function revokeToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

async function getAll() {
    const users = await db.User.find();
    return users.map(x => basicDetails(x));
}

async function getById(id) {
    const user = await getUser(id);
    return basicDetails(user);
}

async function getRefreshTokens(userId) {
    // check that user exists
    await getUser(userId);

    // return refresh tokens for user
    const refreshTokens = await db.RefreshToken.find({ user: userId });
    return refreshTokens;
}

// helper functions

async function getUser(id) {
    if (!db.isValidId(id)) throw 'User not found';
    const user = await db.User.findById(id);
    if (!user) throw 'User not found';
    return user;
}

async function getRefreshToken(token) {
    const refreshToken = await db.RefreshToken.findOne({ token }).populate('user');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

function generateJwtToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign({ sub: user.id, id: user.id }, config.secret, { expiresIn: '15m' });
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

function basicDetails(user) {
    const { id, email, username, role } = user;
    return { id, email, username, role };
}