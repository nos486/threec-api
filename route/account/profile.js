const express = require("express");
const {user} = require("./../../controller")
const {authorize} = require("./../../middleware")
const {ROLE} = require("./../../db")
const router = express.Router();

router.get('/:id', authorize() ,getById);

module.exports =  router;

function getById(req, res, next) {
    // regular users can get their own record and admins can get any record
    if (req.params.id !== req.user.id && req.user.role !== ROLE.ADMIN) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    user.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(next);
}

