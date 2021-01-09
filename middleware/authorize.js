const jwt = require('express-jwt');
const { secret } = require('./../config');
const models = require('./../models')

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [

        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req, res, next) => {
            const user = await models.User.findById(req.user.id);

            if (!user || (roles.length && !roles.includes(user.role))) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            req.user = user
            const refreshTokens = await models.RefreshToken.find({ user: user.id });
            next();
        }

    ];
}