const {userController} = require("./../controller")
const Joi = require("joi")


function userHandler(socket, next) {
    socket.on("getUser",(userId)=>{

        let {error} = validateUserId(userId);

        if (error) {
            next(error);
        }else {
            userController.getUserById(userId).then((user)=>{
                socket.emit("newUser", user);
            })
        }

    })
    next()
}

function validateUserId(userId) {

    let schema = Joi.object({
        userId: Joi.string().required(),
    });

    return schema.validate({userId})
}

module.exports = userHandler;