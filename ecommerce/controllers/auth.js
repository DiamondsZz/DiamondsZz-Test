const User = require("../models/user")
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")
const _ = require("lodash")
const { errorHandler } = require("../helpers/dbErrorHandler")

// 注册
const signup = (req, res) => {
  // 创建用户
  const user = new User(req.body)
  // 将用户插入数据库
  user.save((error, user) => {
    // 如果发生错误
    if (error) {
      // 响应
      return res.status(400).send({ error: errorHandler(error) })
    }
    // 置空盐
    user.salt = undefined
    // 置空密码
    user.hashed_password = undefined
    // 响应
    res.json(user)
  })
}

// 登录
const signin = (req, res) => {
  // 获取 email 和 password
  const { email, password } = req.body
  // 根据 email 查找用户
  User.findOne({ email }, (error, user) => {
    // 如果用户不存在
    if (error || !user) {
      // 响应
      return res.status(400).json({ error: "用户不存在" })
    }
    // 用户存在
    if (!user.authenticate(password)) {
      return res.status(401).json({ error: "邮箱和密码不匹配" })
    }
    // 生成 token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    // 写入 cookie
    res.cookie("t", token, { expire: new Date() + 9999 })
    // 响应
    return res.json({
      token,
      user: _.pick(user, ["_id", "name", "email", "role"])
    })
  })
}

// 退出
const signout = (req, res) => {
  res.clearCookie("t")
  res.json({ message: "退出成功" })
}

// 登录验证
// header => Authorization: Bearer token
const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth"
})

// 验证获取的用户信息是否是登录人的用户信息
const isAuth = (req, res, next) => {
  // req.profile => 通过用户 id 获取的用户信息
  // req.auth => 登录的用户信息
  let user = req.profile && req.auth && req.profile._id == req.auth.id
  if (!user) {
    return res.status(403).json({
      error: "权限不足"
    })
  }
  next()
}

const isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "只有管理员才可以访问"
    })
  }
  next()
}

module.exports = { signup, signin, signout, requireSignin, isAuth, isAdmin }
