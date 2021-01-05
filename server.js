const app = require('./app');
const db = require("./db")
const socket =require("./socket")

const port = 3000

const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
     socket.initSocket(server)
})