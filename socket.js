const {authorize,chatHandler,messageHandler,userHandler}  =require('./socket-middleware')
const { chatController } = require("./controller")

module.exports = io => {
    io.use(authorize)
    io.on("connection", function (socket) {

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
    io.use(userHandler)
    io.use(chatHandler)
    io.use(messageHandler.bind(io))
}



function adapter(socket,next){

}

