const { Order, CartItem } = require("../models/order")
const { addOrderToUserHistory } = require("./user")
const { decreaseQuantity } = require("./product")
const { errorHandler } = require("../helpers/dbErrorHandler")
const Product = require("../models/product")
// const sgMail = require("@sendgrid/mail")

// sgMail.setApiKey(
//   "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"
// )

/**
 *  创建订单
 *  order => { products, transaction_id, amount, address, user}
 */

const orderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: errorHandler(err)
        })
      }
      req.order = order
      next()
    })
}

const createOrder = async order => {
  // 添加订单状态
  order.status = order.result ? "Paid" : "Unpaid"
  // 删除验签结果
  delete order.result
  // 保存订单
  Order.create(order)
    .then(result => {
      // 将商品添加到用户的购买历史记录中
      addOrderToUserHistory(result.user, result._id)
      // 更改商品库存和售卖数量
      decreaseQuantity(result._id)
    })
    .catch(error => console.log(console.log("创建订单失败", error)))
}

const listOrders = (req, res) => {
  Order.find()
    // .populate("user", "_id name")
    .populate([
      { path: "user", select: "_id name" },
      { path: "products.product", select: "name price" }
    ])
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error)
        })
      }
      res.json(orders)
    })
}

const updateOrderStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        })
      }
      res.json(order)
    }
  )
}

module.exports = {
  createOrder,
  listOrders,
  updateOrderStatus,
  orderById
}
