const {chatController} = require("./../controller")

function chatHandler(socket, next) {
    socket.on("getChats",()=>{
        chatController.getUserChats(socket.userId).then((chats)=>{
            socket.emit("chats",chats)
        })
    })
    next()
}

module.exports = chatHandler;