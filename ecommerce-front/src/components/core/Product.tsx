import { Col, Row } from "antd"
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import Layout from "./Layout"
import { useDispatch, useSelector } from "react-redux"
import { getProductById } from "../../store/actions/product.actions"
import { AppState } from "../../store/reducers/index"
import { ProductState } from "../../store/reducers/product.reducer"
import ProductItem from "./ProductItem"

const Product = () => {
  const dispatch = useDispatch()
  const { product } = useSelector<AppState, ProductState>(
    state => state.product
  )
  const { productId } = useParams<{ productId: string }>()
  useEffect(() => {
    dispatch(getProductById({ productId }))
  }, [])
  return (
    <Layout title="商品名称" subTitle="商品描述">
      <Row gutter={36}>
        <Col span="18">
          <ProductItem showViewProduct={false} product={product.result} />
        </Col>
        <Col span="6">right</Col>
      </Row>
    </Layout>
  )
}

export default Product
