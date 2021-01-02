module.exports = function (io) {
    io.on("chat", function (socket) {
        console.log(socket)
    })
}