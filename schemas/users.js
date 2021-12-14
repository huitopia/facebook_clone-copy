const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    userId: Number,
    userName: String,
    userEmail: String,
    hashedPassword: String,
    createAt: Date,
})
module.exports = mongoose.model('User', UserSchema)
