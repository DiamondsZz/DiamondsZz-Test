const express = require("express")
const {
  create,
  categoryById,
  read,
  update,
  remove,
  list
} = require("../controllers/category")
const { userById } = require("../controllers/user")

const router = express.Router()

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth")

// 创建分类
router.post(
  "/category/create/:userId",
  [requireSignin, isAuth, isAdmin],
  create
)
// 根据 id 获取分类
router.get("/category/:categoryId", read)

// 根据 id 更新分类
router.put(
  "/category/:categoryId/:userId",
  [requireSignin, isAuth, isAdmin],
  update
)

// 根据 id 删除分类
router.delete(
  "/category/:categoryId/:userId",
  [requireSignin, isAuth, isAdmin],
  remove
)
// 获取分类列表
router.get("/categories", list)

router.param("userId", userById)
router.param("categoryId", categoryById)

module.exports = router
