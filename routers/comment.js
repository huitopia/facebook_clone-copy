const express = require('express')
const router = express.Router()
const url = require('url')
const Comments = require('../schemas/comments')
const authMiddleware = require('../middlewares/auth-middleware')

module.exports = router
