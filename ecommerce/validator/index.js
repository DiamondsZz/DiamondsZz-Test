const userSignupValidator = (req, res, next) => {
  req.check("name", "请传入昵称").notEmpty()
  req
    .check("email", "邮箱最少3个字符最多32字符")
    .matches(/.+\@.+\..+/)
    .withMessage("邮箱地址中需要包含@")
    .isLength({
      min: 4,
      max: 32
    })
  req.check("password", "请传入密码").notEmpty()
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("密码不能小于6位")
    .matches(/\d/)
    .withMessage("密码必须包含一个数值")
  const errors = req.validationErrors()
  if (errors) {
    const firstError = errors.map(error => error.msg)[0]
    return res.status(400).json({ error: firstError })
  }
  next()
}

module.exports = { userSignupValidator }
