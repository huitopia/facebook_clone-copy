const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../schemas/users')
const bcrypt = require('bcrypt')
const authMiddleware = require('../middlewares/auth-middleware')
const Joi = require('joi')

// 회원가입 유효성 검사(Joi)
const registerSchema = Joi.object({
  userName: Joi.string().pattern(new RegExp("^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\\s|0-9a-zA-z]{2,10}$")).required(),
  userEmail: Joi.string().pattern(new RegExp("^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\\.[a-zA-Z]{2,6}$")).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')).required(),
})

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const recentUser = await User.find().sort("-userId").limit(1)
    let userId = 1
    if(recentUser.length != 0){
      userId = recentUser[0]['userId'] + 1
    }

    const { userName, userEmail, password } = await registerSchema.validateAsync(req.body)
    if (userName === password) {
      res.status(400).send({
        errorMessage: "아이디, 비밀번호가 같습니다."
      })
      return
    }
    else if (userEmail === password) {
      res.status(400).send({
        errorMessage: "이메일, 비밀번호가 같습니다."
      })
      return
    }

    // 이메일 중복 확인
    const eMail = await User.find({ userEmail: userEmail })
    if (eMail.length !== 0) {
      res.status(400).send({
        errorMessage: "이메일이 중복되었습니다."
      })
      return
    }

    // bcrypt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log("bcrypt 작동 확인")

    const createdAt = new Date(+new Date() + 3240 * 10000)
      .toISOString()
      .replace('T', ' ')
      .replace(/\..*/, '')
    
    await User.create({ userId, userName, userEmail, hashedPassword, createdAt });

    res.status(201).send({
      result: "회원가입 완료"
    })
  } catch (err) {
    res.status(400).send({
      errorMessage: "입력한 내용을 다시 확인 해주세요"
    })
  }
})

// 로그인 검증(Joi)
const loginSchema = Joi.object({
  userEmail: Joi.string().required(),
  password: Joi.string().required()
})

// 로그인
router.post('/login', async (req, res) => {
  const { userEmail, password } = await loginSchema.validateAsync(req.body)
  // console.log( userEmail, password )
  const user = await User.findOne({ userEmail }).exec()
  // console.log(user)
  if (!user) {
    res.status(400).send({
      errorMessage: "이메일 또는 비밀번호를 확인해주세요.", success: false
    })
    return
  }

  const authenticate = await bcrypt.compare(password, user.hashedPassword)
  if (authenticate === true) {
    const token = jwt.sign({ userId: user.userId }, 'my-secret-key')
    res.send({
      result: "success",
      userEmail,
      token,
    })
  } else {
    res.status(401).send({
      errorMessage: "이메일 또는 비밀번호가 잘못됐습니다.", success: false
    })
    return
  }
})

// 로그인 인증
router.get('/me', authMiddleware, async(req, res) => {
  const { user } = res.locals
  // console.log("##########사용자 정보##########", res.locals)
  res.send({
    user: {
      userId:user.userId,
      userEmail:user.userEmail,
      userName:user.userName
    }
  })
})


// 검색
router.post('/post/search', async(req, res) => {
  // 검색창에 user 검색
  const searchUser = req.body;
  console.log(searchUser['userName'])
  try{
    const tag = searchUser['userName'].trim();
    const search = await User.find({ userName: new RegExp(tag,'i')}).sort('-createdAt')
    res.status(200).send({ result: {search}})
    console.log(search)
  } catch(error){
    res.status(400).send({ errorMessage: "검색중 오류 발생"})
  }
})

module.exports = router