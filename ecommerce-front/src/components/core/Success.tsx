import { Button } from "antd"
import React from "react"
import { Link } from "react-router-dom"
import Layout from "./Layout"

const Success = () => {
  return (
    <Layout title="支付完成" subTitle="">
      <Button>
        <Link to="/">继续购物</Link>
      </Button>
    </Layout>
  )
}

export default Success
