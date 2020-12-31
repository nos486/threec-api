const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const cors = require("cors")
require("./db")
const cookieParser = require('cookie-parser');
const apiRouter = require("./route/index")
const errorHandler = require("./middleware/error-handler");


const app = express()
const port = 3000

//json body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    exposedHeaders: 'Key',
}))


//routes
app.use('/api/v1', apiRouter);

// global error handler
app.use(errorHandler);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})







