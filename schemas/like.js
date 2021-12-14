const mongoose = require('mongoose')

const LikeSchema = new mongoose.Schema({
    postId: Number,
    userId: Number
})

module.exports = mongoose.model('Like', LikeSchema)