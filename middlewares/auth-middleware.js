const jwt = require('jsonwebtoken')
const User = require('../schemas/users') // 실제로 데이터베이스에 조회해야 되니까 유저 사용자 모델이 필요

// 로그인되어있는 토큰을 가져와 유저 정보를 담아주는 middleware
module.exports = (req, res, next) => {
    console.log("미들웨어 동작 확인 완료") // 미들웨어 호출 확인
    const { authorization } = req.headers // http 인증 시 header에 담아서 보냄
    console.log(req.headers)
    console.log(authorization)
    const [tokenType, tokenValue] = authorization.split(' ')

    if (tokenType !== 'Bearer') {
        // 참보다 거짓일 경우로 하는 것이 편하다.
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.',
        })
        return
    }

    if (tokenValue !== 'null') {
        // 참보다 거짓일 경우로 하는 것이 편하다.
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.',
        })
        return
    }

    try {
        const { userId } = jwt.verify(tokenValue, 'my-secret-key')
        // jwt가 유효할 때만 데이터베이스에서 사용자 정보를 불러와서 res.locals에 담아준다.
        User.findOne({ userId })
            .exec()
            .then((user) => {
                // async가 없으므로 await은 안됨. promise then
                res.locals.user = user
                next()
            })
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.',
        })
        return
    }
}
