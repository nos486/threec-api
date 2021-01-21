const mongoose = require('mongoose');
const {chatController} = require("./controller");
const {CHAT_TYPE} = require("./models/enums")

const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1/apiService", connectionOptions).then(async () => {
    console.log(`db connected`);

    //create global chat
    if(! await chatController.isChatExist("global")){
        await chatController.createChat({
            username:"global",
            name : "Global",
            type : CHAT_TYPE.GROUP,
        })
    }
    // chatController.createChat()
});

mongoose.Promise = global.Promise;
