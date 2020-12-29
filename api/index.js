import express from "express";
import User from "../models/user.js";
import cache from "memory-cache"

const router = express.Router();

router.get('/', (req, res,next) => {

    res.send(cache.get("name"))

})

async function createUser() {
    const user1 = new User({
        username: 'sina',
    });

    await user1.save();
}

export default router