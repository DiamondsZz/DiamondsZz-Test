const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")

const expressValidator = require("express-validator")
const cors = require("cors")

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const alipayRoutes = require("./routes/alipay")
const orderRoutes = require("./routes/order")

const app = express()

require("./models/connect")

app.use(cors())
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(expressValidator())

app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)
app.use("/api", alipayRoutes)
app.use("/api", orderRoutes)

const APP_PORT = process.env.APP_PORT || 80

app.listen(APP_PORT, () =>
  console.log(`服务器启动成功, 监听 ${APP_PORT} 端口`)
)
