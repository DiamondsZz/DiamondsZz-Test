const express = require("express")
const { signup, signin, signout } = require("../controllers/auth")
const { userSignupValidator } = require("../validator")

const router = express.Router()

// 注册
router.post("/signup", userSignupValidator, signup)
// 登录
router.post("/signin", signin)
// 退出
router.get("/signout", signout)

module.exports = router
