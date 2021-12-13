const mongoose = require('mongoose')

const PostsSchema = new mongoose.Schema({
    postId: Number,
    userId: String,
    userName: String,
    content: String,
})
module.exports = mongoose.model('Posts', PostsSchema)
