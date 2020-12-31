const mongoose = require('mongoose');
const enums = require("./models/enums")

const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1/apiService" , connectionOptions).then(async () =>{
    console.log(`db connected`)
});
mongoose.Promise = global.Promise;

module.exports = {
    ...enums,
    User: require('./models/user'),
    RefreshToken: require('./models/refresh-token'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}