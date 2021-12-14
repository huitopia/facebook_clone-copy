const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    userId: Number,
    userName: String,
    userEmail: String,
    hashedPassword: String,
    createdAt: String,
})
module.exports = mongoose.model('User', UserSchema)
