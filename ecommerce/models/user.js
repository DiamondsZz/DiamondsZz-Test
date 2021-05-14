const mongoose = require("mongoose")
const crypto = require("crypto")
const { v1: uuidv1 } = require("uuid")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [4, "昵称长度不能大于4"],
      required: [true, "请填写昵称"]
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "请填写邮件地址"]
    },
    hashed_password: {
      type: String,
      required: true
    },
    about: {
      type: String,
      trim: true
    },
    salt: String,
    role: {
      type: Number,
      default: 0
    },
    history: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
)

// 添加虚拟属性 password
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password
    this.salt = uuidv1()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

// 添加和用户相关的实例方法
userSchema.methods = {
  // 验证密码
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  // 密码加密
  encryptPassword: function (password) {
    if (!password) return ""
    try {
      return crypto.createHmac("sha1", this.salt).update(password).digest("hex")
    } catch (err) {
      return ""
    }
  }
}

userSchema.plugin(uniqueValidator, { message: "{VALUE} 已经存在, 请更换" })

module.exports = mongoose.model("User", userSchema)
