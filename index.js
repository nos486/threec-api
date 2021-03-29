const app = require('./app');
const db = require("./db")
const socket =require("./socket")

const port = 80

const server = app.listen(port, () => {
    console.log(`Example app listening at http://0.0.0.0:${port}`)
    socket.initSocket(server)
})