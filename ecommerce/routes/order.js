const express = require("express")
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth")
const { userById } = require("../controllers/user")
const {
  listOrders,
  updateOrderStatus,
  orderById
} = require("../controllers/order")

const router = express.Router()

// 获取订单列表
router.get(
  "/order/list/:userId",
  [requireSignin, isAuth, isAdmin],
  listOrders
)

// 修改订单状态
router.put(
  "/order/status/:userId",
  [requireSignin, isAuth, isAdmin],
  updateOrderStatus
)

router.param("userId", userById)
router.param("orderId", orderById)

module.exports = router
