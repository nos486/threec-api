const {authorize,chatHandler,messageHandler}  =require('./socket-middleware')

module.exports = io => {
    io.use(authorize)
    io.on("connection", function (socket) {

        socket.emit('message', 'You have successfully joined the chat')
        socket.on('disconnect', () => {
            console.log('user disconnected',socket.userId);
        });
    })
    io.use(chatHandler)
    io.use(messageHandler)
}

