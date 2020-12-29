import express from "express"
import mongoose from "mongoose";
import bodyParser from "body-parser"
import cors from "cors"
import "./db.js"

import apiRouter from "./api/api.js"

const app = express()
const port = 3000

//json body parser
app.use(bodyParser.json())
app.use(cors({
    exposedHeaders: 'Key',
}))


//routes
app.use('/api/v1', apiRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})







