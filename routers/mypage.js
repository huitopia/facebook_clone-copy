const express = require('express')
const Posts = require('../schemas/posts')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/auth-middleware')

const router = express.Router()

router.get('/post/:postId', async (req, res) => {
    const { postId } = req.params;
    const post = await Posts.findOne({ postId });
    res.json(post);
})
module.exports = router
