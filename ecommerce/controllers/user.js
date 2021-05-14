const User = require("../models/user")
const { Order } = require("../models/order")

const userById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) return res.status(400).json({ error: "用户没找到" })
    req.profile = user
    next()
  })
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

const update = (req, res) => {
  const { name, password } = req.body

  User.findOne({ _id: req.profile._id }, (err, user) => {
    if (err || !user) return res.status(400).json({ error: "用户不存在" })
    if (!name) {
      return res.status(400).json({ error: "请传入昵称" })
    } else {
      user.name = name
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: "密码最少6位" })
      } else {
        user.password = password
      }
    }

    user.save((err, updatedUser) => {
      if (err) return res.status(400).json({ error: "用户信息更新失败" })
      updatedUser.hashed_password = undefined
      updatedUser.salt = undefined
      res.json(updatedUser)
    })
  })
}

const addOrderToUserHistory = (userId, orderId) => {
  let history = []

  Order.findOne({ _id: orderId })
    .populate("products.product")
    .then(order => {
      order.products.forEach(item => {
        history.push({
          _id: item.product._id,
          name: item.product.name,
          description: item.product.description,
          category: item.product.category,
          quantity: item.count,
          transaction_id: order.trade_no,
          amount: order.amount
        })
      })
      User.findOneAndUpdate(
        { _id: userId },
        { $push: { history: history } },
        { new: true, useFindAndModify: false },
        error => {
          if (error) console.log("用户历史购买信息添加失败")
        }
      )
    })
    .catch(e =>
      console.log(
        "订单信息获取失败导致无法将产品添加到用户购买的历史记录里中",
        e
      )
    )
}

const purchaseHistory = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate([
      { path: "user", select: "_id name" },
      { path: "products.product", select: "-photo" }
    ])
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        })
      }
      res.json(orders)
    })
}

module.exports = {
  userById,
  read,
  update,
  addOrderToUserHistory,
  purchaseHistory
}
