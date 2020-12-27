import express from "express"
import mongoose from "mongoose";
import User from "./models/user.js"

import indexRouter from "./routes/index.js"
import loginRouter from "./routes/login.js"

const app = express()
const port = 3000
const eraseDatabaseOnSync = false;

app.use('/', indexRouter);
app.use('/login', loginRouter);

mongoose.connect("mongodb://127.0.0.1/apiService", {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true}).then(async () =>{

    if (eraseDatabaseOnSync) {
        await Promise.all([
            models.User.deleteMany({}),
            models.Message.deleteMany({}),
        ]);
    }

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
});






