const express = require('express')
const router = express.Router()
const url = require('url')
const Comments = require('../schemas/comments')
const authMiddleware = require('../middlewares/auth-middleware')

// 댓글 등록
router.post('/comments/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params
    const { content } = req.body
    const { user } = res.locals
    const userId = user["userId"]
    const userName = user["userName"]
    // console.log("##########userId##########: ", userId)
    // console.log("##########userName##########: ", userName)

    try {
        if (content === undefined) {
            res.status(401).send({
                errorMessage: "댓글을 입력해주세요"
            })
            return
        }
        // console.log("###########content###########", content)
        const recentComment = await Comments.find().sort("-commentId").limit(1)
        let commentId = 1
        if (recentComment.length !== 0) {
            commentId = recentComment[0]["commentId"] + 1
        }
        await Comments.create({ commentId, postId, userId, userName, content })
        res.status(201).send({
            result: "댓글 등록 완료"
        })
        return
    } catch (error) {
        res.status(400).send({
            errorMessage: "댓글 등록 실패"
        })
        return
    }

})

// 댓글 조회
router.get('/comments/:postId', async (req, res) => {
    const { postId } = req.params
    // console.log("###########postId##########", postId)
    try {
        const comment = await Comments.find({ postId }).sort("-commentId")
        // console.log("##########comment##########", comment)
        res.json({ comment: comment })
    } catch (error) {
        res.status(400).send({
            errorMessage: "댓글 불러오기 중 오류가 발생했습니다"
        })
    }
})

// 댓글 수정
router.put('/comments/:commentId', authMiddleware, async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body
    const { user } = res.locals
    const commentUser = await Comments.findOne({ commentId })

    const tokenUserId = user["userId"]
    // console.log("##########tokenUserId##########: ", tokenUserId)
    const dbUserId = commentUser["userId"]
    // console.log("##########dbUserId##########: ", dbUserId)

    if (tokenUserId === dbUserId && content !== undefined) {
        await Comments.updateOne({ commentId }, { $set: { content } })
        console.log("#######content#######:", content)
        res.status(201).send({
            result: "댓글 등록 완료"
        })
    } else {
        res.status(400).send({
            errorMessage: "댓글 수정 중 오류가 발생했습니다"
        })
    }
})

// 댓글 삭제
router.delete('/comments/:commentId', authMiddleware, async(req, res) => {
    const { user } = res.locals
    const { commentId } = req.params
    const commentUser = await Comments.findOne({ commentId })

    const tokenUserId = user["userId"]
    // console.log("##########tokenUserId##########: ", tokenUserId)
    const dbUserId = commentUser["userId"]
    // console.log("##########dbUserId##########: ", dbUserId)

    if (tokenUserId === dbUserId) {
        await Comments.deleteOne({ commentId })
        res.status(201).send({
            result: "댓글 삭제 완료"
        })
    } else {
        res.status(400).send({
            errorMessage: "댓글 삭제 중 오류가 발생했습니다"
        })
    }
})

module.exports = router
