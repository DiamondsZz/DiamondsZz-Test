const mongoose = require("mongoose")
const config = require("config")

const { host, port, user, pass, name } = config.get("db_config")

mongoose
  .connect(`mongodb://${host}:${port}/${name}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    user: user,
    pass: pass
  })
  .then(() => console.log("数据库连接成功"))
  .catch(() => console.log("数据库连接失败"))
