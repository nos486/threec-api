const socketIo = require("socket.io")
const {authorize,chatHandler,messageHandler,userHandler}  =require('./socket-middleware')
const { chatController } = require("./controller")


class Socket {
    constructor() {

        //singleton class
        let inst = !! Socket.instance
        if (inst) {
            return Socket.instance;
        }else {
            // this.addToLogFile("created")
        }
        Socket.instance = this;
        return this;

    }

    initSocket(server) {
        this._io = socketIo(server,{
            cors: {
                origin: (origin, callback) => callback(null, true),
                credentials: true
            }
        });

        this._io.use(authorize)
        this._io.on("connection", function (socket) {

            chatController.getUserChats(socket.userId).then((chats)=>{
                for(let chat of chats){
                    socket.join(chat.id)
                }
                // socket.emit("chats",chats)
            })

            // io.to("5ff0e405fedfca2378cfe089").emit('message', 'You have successfully joined the chat');

            socket.emit('message', 'You have successfully joined the chat')
            socket.on('disconnect', () => {
                console.log('user disconnected',socket.userId);
            });
        })
        this._io.use(userHandler)
        this._io.use(chatHandler)
        this._io.use(messageHandler.bind(this._io))

    }

    get io(){
        return this._io
    }
}

module.exports = new Socket()

