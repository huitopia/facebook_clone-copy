const mongoose = require('mongoose')

const PostsSchema = new mongoose.Schema({
    postId: Number,
    userId: Number,
    userName: String,
    img: String,
    content: String,
    createdAt: String,
    likeCnt: Number,
})
module.exports = mongoose.model('Posts', PostsSchema)
