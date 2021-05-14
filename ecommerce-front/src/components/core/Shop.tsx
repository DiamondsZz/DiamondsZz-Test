import { Button, Col, Empty, Row, Space } from "antd"
import React, { useState, useEffect } from "react"
import Checkbox from "./CheckBox"
import Layout from "./Layout"
import RadioBox from "./RadioBox"
import { useDispatch, useSelector } from "react-redux"
import { filterProduct } from "../../store/actions/product.actions"
import { AppState } from "../../store/reducers/index"
import { ProductState } from "../../store/reducers/product.reducer"
import ProductItem from "./ProductItem"

const Shop = () => {
  const dispatch = useDispatch()

  const [skip, setSkip] = useState<number>(0)

  const product = useSelector<AppState, ProductState>(state => state.product)

  const [myFilters, setMyFilter] = useState<{
    category: string[]
    price: number[]
  }>({ category: [], price: [] })

  useEffect(() => {
    setSkip(0)
  }, [myFilters])

  useEffect(() => {
    dispatch(filterProduct({ filters: myFilters, skip }))
  }, [myFilters, skip])

  const filterDOM = () => (
    <Space size="middle" direction="vertical">
      <Checkbox
        handleFilter={(filters: string[]) => {
          setMyFilter({ ...myFilters, category: filters })
        }}
      />
      <RadioBox
        handleFilter={(filters: number[]) => {
          setMyFilter({ ...myFilters, price: filters })
        }}
      />
    </Space>
  )

  const productDOM = () => (
    <Row gutter={[16, 16]}>
      {product.filter.result.data.map(item => (
        <Col key={item._id} span="6">
          <ProductItem product={item} />
        </Col>
      ))}
    </Row>
  )

  const loadMoreButton = () => {
    return (
      <Row>
        {product.filter.result.size >= 4 && (
          <Button onClick={loadMore}>加载更多</Button>
        )}
      </Row>
    )
  }

  const loadMore = () => {
    setSkip(skip + 4)
  }

  const noData = () => {
    return <Row>{product.filter.result.size === 0 && <Empty />}</Row>
  }

  return (
    <Layout title="拉勾商城" subTitle="挑选你喜欢的商品吧">
      <Row>
        <Col span="4">{filterDOM()}</Col>
        <Col span="20">
          {productDOM()} {loadMoreButton()} {noData()}
        </Col>
      </Row>
    </Layout>
  )
}

export default Shop
