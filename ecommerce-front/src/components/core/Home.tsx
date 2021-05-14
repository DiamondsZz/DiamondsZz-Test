import { Col, Row, Typography } from "antd"
import React, { useEffect } from "react"
import Layout from "./Layout"
import ProductItem from "./ProductItem"
import Search from "./Search"
import { useDispatch, useSelector } from "react-redux"
import { getProduct } from "../../store/actions/product.actions"
import { AppState } from "../../store/reducers/index"
import { ProductState } from "../../store/reducers/product.reducer"

const { Title } = Typography

const Home = () => {
  const dispatch = useDispatch()

  const { createdAt, sold } = useSelector<AppState, ProductState>(
    state => state.product
  )

  useEffect(() => {
    dispatch(getProduct("createdAt"))
    dispatch(getProduct("sold"))
  }, [])

  return (
    <Layout title="拉勾电商" subTitle="欢迎来到拉勾电商, 尽情享受吧">
      <Search />
      <Title level={5}>最新上架</Title>
      <Row gutter={[16, 16]}>
        {createdAt.products.map(item => (
          <Col key={item._id} span="6">
            <ProductItem product={item} />
          </Col>
        ))}
      </Row>
      <Title level={5}>最受欢迎</Title>
      <Row gutter={[16, 16]}>
        {sold.products.map(item => (
          <Col key={item._id} span="6">
            <ProductItem product={item} />
          </Col>
        ))}
      </Row>
    </Layout>
  )
}

export default Home
