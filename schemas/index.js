const mongoose = require('mongoose')

const connect = () => {
    mongoose
        .connect('mongodb://test:test@localhost:27017/facebook',{
            // 'mongodb://127.0.0.1:27017/facebook', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ignoreUndefined: true,
        })
        .catch((err) => console.log(err))
}

mongoose.connection.on('error', (err) => {
    console.error('몽고디비 연결 에러', err)
})

module.exports = connect
