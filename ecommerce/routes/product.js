const express = require("express")
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth")
const { userById } = require("../controllers/user")
const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listByFilter,
  photo,
  listSearch
} = require("../controllers/product")

const router = express.Router()

// 获取商品列表
router.get("/products", list)

// 获取相关产品列表
router.get("/products/related/:productId", listRelated)

// 根据 id 获取产品信息
router.get("/product/:productId", read)

// 获取产品列表中使用到的分类信息
router.get("/products/categories", listCategories)

// 商品搜索
router.get("/products/search", listSearch)

// 搜索过滤
router.post("/products/filter", listByFilter)

// 根据产品 id 获取产品封面
router.get("/product/photo/:productId", photo)

// 新增产品
router.post(
  "/product/create/:userId",
  [requireSignin, isAuth, isAdmin],
  create
)

// 根据 id 删除产品
router.delete(
  "/product/:productId/:userId",
  [requireSignin, isAuth, isAdmin],
  remove
)

// 根据 id 更新产品
router.put(
  "/product/:productId/:userId",
  [requireSignin, isAuth, isAdmin],
  update
)

router.param("userId", userById)
router.param("productId", productById)

module.exports = router
