import React, { useState, useEffect, ChangeEvent } from "react"
import Layout from "./Layout"
import { CartItem, getCart } from "../../helpers/cart"
import { Col, Divider, Input, Row } from "antd"
import CartItemFc from "./CartItemFc"
import TotalPrice from "./TotalPrice"
import Pay from "./Pay"

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [address, setAddress] = useState<string>("")
  const [totalPrice, setTotalPrice] = useState<number>(() => {
    return 0
  })

  useEffect(() => {
    setCart(getCart())
  }, [])

  const showCart = () => (
    <table style={{ width: "100%" }}>
      <thead className="ant-table-thead">
        <tr>
          <th className="ant-table-cell">商品封面</th>
          <th className="ant-table-cell">商品名称</th>
          <th className="ant-table-cell">商品价格</th>
          <th className="ant-table-cell">商品分类</th>
          <th className="ant-table-cell">商品数量</th>
          <th className="ant-table-cell">操作</th>
        </tr>
      </thead>
      <tbody className="ant-table-tbody">
        {cart.map(item => (
          <CartItemFc key={item._id} setCart={setCart} product={item} />
        ))}
      </tbody>
    </table>
  )

  return (
    <Layout title="购物车" subTitle="付款吧, 我就是你的了">
      <Row gutter={16}>
        <Col span="16">{showCart()}</Col>
        <Col span="8">
          <Row>
            <Input
              value={address}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setAddress(event.target.value)
              }
              placeholder="请输入收货地址"
            />
          </Row>
          <Divider />
          <Row>
            <TotalPrice cart={cart} setTotalPrice={setTotalPrice} />
          </Row>
          <Row>
            <Pay totalPrice={totalPrice} cart={cart} address={address} />
          </Row>
        </Col>
      </Row>
    </Layout>
  )
}

export default Cart
