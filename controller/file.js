const models = require('./../models')
const jwt = require("jsonwebtoken");
const fs = require('fs')
const path = require('path');


module.exports = {
    newFile,
    getFile,
    deleteFile
}

async function newFile({name,hash,type,size,path}){
    let file = new models.File({
        name,
        hash,
        type,
        size,
        path,
    })

    return await file.save()
}

async function getFile(file_id){
    if (!models.isValidId(file_id)) throw "Id not valid"
    let file = await models.File.find({_id:file_id})
    return file
}


async function deleteFile(fileId){

    if (!models.isValidId(fileId)) throw "Id not valid"
    let file = await models.File.findOneAndDelete({_id:fileId})

    fs.unlink(path.join(__dirname,"./../",file.path), (err) => {
        if (err) {
            throw err
        }
        return file
    })
}

