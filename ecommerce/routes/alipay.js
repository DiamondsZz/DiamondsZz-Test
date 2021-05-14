const express = require("express")
const router = express.Router()
const { getPayUrl, verifySignature } = require("../controllers/alipay")

// 获取支付地址
router.post("/alipay", getPayUrl)

// 验签
router.post("/verify_signature", verifySignature)

module.exports = router
