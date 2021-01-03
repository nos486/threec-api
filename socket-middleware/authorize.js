const jwt = require('jsonwebtoken');
const { secret } = require('./../config');

function authorize(socket, next) {
    let token = socket.handshake.query.token

    // jwt.sign({ id: user.id }, config.secret, { expiresIn: '15m' });

    jwt.verify(token,secret,function(err, decoded) {
        if(decoded){
            console.log(decoded)
            socket.userId = decoded.id
            next()
        }

        if(err){
            next(err);
        }
    })
}

module.exports = authorize;