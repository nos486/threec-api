const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("./db")
const apiRouter = require("./route/index")
const errorHandler = require("./middleware/error-handler");
const socket = require('socket.io')


const app = express()
const port = 3000

//json body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    exposedHeaders: 'Key',
}))

app.use( '/static',express.static('public'))

//routes
app.use('/api/v1', apiRouter);


// global error handler
app.use(errorHandler);


const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const io = socket(server,{
    cors: {
        origin: (origin, callback) => callback(null, true),
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
});
