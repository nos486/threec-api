import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1/apiService", {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true}).then(async () =>{
    console.log(`db connected`)
});