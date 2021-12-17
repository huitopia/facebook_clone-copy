const express = require('express')
const Posts = require('../schemas/posts')
const Users = require('../schemas/users')
const Comment = require('../schemas/comments')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/auth-middleware')

const router = express.Router()

//  마이페이지 내 정보 조회 및 내 정보 수정 관련 조회
router.get('/mypage/:userId', authMiddleware, async (req, res) => {
    const { userId } = req.params;
    const user = await Users.findOne({ userId: userId });
    const userEmail = user.userEmail
    const userName = user.userName

    if (!user) {
        res.status.send({
            errorMessage: "본인이 작성한 글이 아닙니다."
        })
    }
    res.send({
        userEmail: userEmail,
        userName: userName
    })
})

// 내가 작성한 게시물 조회
router.get('/mypage/posts/:userId', authMiddleware, async (req, res) => {
    const { userId } = req.params
    const posts = await Posts.find({ userId: userId })
    res.send({ posts: posts })
})

// 내 정보 수정
router.patch('/mypage/:userId', authMiddleware, async (req, res) => {
    const { userId } = req.params
    const { userName } = req.body
    const user = await Users.findOne({ userId: userId })
    const nickName = user.userName

    if (nickName) {
        await Users.updateOne({ userId: userId }, { $set: { userName: userName } })
        await Comment.updateMany({ userId: userId }, { $set: { userName: userName } })
        await Posts.updateMany({ userId: userId }, { $set: { userName: userName } })
        res.send({
            result: 'success'
        })
    }
})

module.exports = router
