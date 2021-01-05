const mongoose = require("mongoose");

module.exports = {
    ...require("./enums"),
    User: require('./user'),
    RefreshToken: require('./refresh-token'),
    Chat: require('./chat'),
    Message: require('./message'),
    File: require('./file'),
    isValidId
};


function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}