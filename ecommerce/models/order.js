const mongoose = require("mongoose")

// 购物车中的每一个商品
const CartItemSchema = new mongoose.Schema({
  // 商品数据
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  // 商品数量
  count: Number
})

const CartItem = mongoose.model("CartItem", CartItemSchema)

// 订单
const OrderSchema = new mongoose.Schema(
  {
    // 订单中包含的商品
    products: [CartItemSchema],
    // 交易 id (支付返回)
    trade_no: String,
    // 总价
    amount: { type: Number },
    // 收货地址
    address: String,
    // 订单状态
    // Unpaid => 未付款
    // Paid => 已付款
    // Shipped => 运输中
    // Completed => 已完成
    // Cancelled => 已取消
    status: {
      type: String,
      default: "Unpaid",
      enum: ["Unpaid", "Paid", "Shipped", "Delivered", "Cancelled"] // enum means string objects
    },
    // 更新日期
    updated: Date,
    // 订单所属用户
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
)

const Order = mongoose.model("Order", OrderSchema)

module.exports = { Order, CartItem }
