
module.exports = io => {
    io.on("connection", function (socket) {

        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.emit('message', 'You have successfully joined the chat')


        socket.on("chat", function (message) {
            console.log(message)
            io.emit("chat","odsadsadasd")
            socket.emit("chat","odsadsadasd")
        })


    })

    setInterval(()=>{
        io.sockets.emit("message","all is ok")
    },5000)
}
