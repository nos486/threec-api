const models = require('./../models')
const jwt = require("jsonwebtoken");

module.exports = {
    newFile,
    getFile
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
    let file = await models.File.find({_id:file_id})
    return file
}

