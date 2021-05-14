const AlipaySDK = require("alipay-sdk").default
const AlipayFormData = require("alipay-sdk/lib/form").default
const fs = require("fs")
const path = require("path")
const orderid = require("order-id")(process.env.ORDER_SECERT)
const { createOrder } = require("../controllers/order")

const alipayBaseConfig = {
  appId: "2016103100782024", // appId
  privateKey: fs.readFileSync(
    path.join(__dirname, "../pem/private_key.pem"), // 私钥
    "ascii"
  ),
  charset: "utf-8",
  signType: "RSA2", // 签名类型
  alipayPublicKey: fs.readFileSync(
    path.join(__dirname, "../pem/alipay_public_key.pem"),
    "ascii"
  ), // 支付宝公钥
  gateway: "https://openapi.alipaydev.com/gateway.do", // 网关地址
  timeout: 5000, // 网关超时时间
  camelcase: true // 是否将网关返回的下划线 key 转换为驼峰写法
}

// 获取支付地址
const getPayUrl = async (req, res) => {
  // totalAmount 订单总金额
  // subject 订单标题
  // body 订单描述
  const { totalAmount, subject, body, products, address, userId } = req.body

  const alipaySdk = new AlipaySDK(alipayBaseConfig)

  // 返回支付链接
  const formData = new AlipayFormData()
  formData.setMethod("get")
  // 客户端支付成功后会同步跳回的地址
  formData.addField("returnUrl", "http://localhost:5000/#/paysuccess")
  // 支付宝在用户支付成功后会异步通知的回调地址, 必须在公网 IP 上才能收到
  formData.addField(
    "notifyUrl",
    "http://fullstack.net.cn/api/verify_signature"
  )
  formData.addField("appId", "2016103100782024")
  formData.addField("charset", "utf-8")
  formData.addField("signType", "RSA2")
  formData.addField("bizContent", {
    outTradeNo: orderid.generate(), // [必选] 商户订单号: 64个字符内, 包含数字, 字母, 下划线.
    productCode: "FAST_INSTANT_TRADE_PAY", // [必选] 销售产品码, 目前仅支持FAST_INSTANT_TRADE_PAY
    totalAmount, // [必选] 订单总金额, 精确到小数点后两位
    subject, // [必选] 订单标题
    body, // [必选] 订单描述 对象嵌套层级不能太深
    passback_params: JSON.stringify({ products, address, userId })
  })

  /**
   * exec 对应参数
   * method: 调用支付宝 api
   * params: api请求的参数, 包含公共请求参数和业务参数
   * options: validateSign, formData, log
   */

  const result = await alipaySdk.exec(
    "alipay.trade.page.pay",
    {},
    { formData }
  )

  res.json({ result })
}

// 验签
const verifySignature = async (req, res) => {
  // 初始化
  const alipaySdk = new AlipaySDK(alipayBaseConfig)
  // result 为布尔值, 表示是否验签通过
  const result = await alipaySdk.checkNotifySign(req.body)
  // 获取回传参数
  const passback = JSON.parse(req.body.passback_params)
  // 创建订单
  createOrder({
    trade_no: req.body.trade_no,
    amount: req.body.total_amount,
    address: passback.address,
    products: passback.products,
    user: passback.userId,
    result
  })

  res.end("success")
}

module.exports = {
  getPayUrl,
  verifySignature
}
