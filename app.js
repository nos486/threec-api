const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const apiRouter = require("./route/index")
const errorHandler = require("./middleware/error-handler");

const app = express()


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

module.exports = app

