import { Product } from "./product"
import { User } from "./auth"

export interface OrderProduct {
  _id: string
  count: number
  product: Product
}

export interface Order {
  _id: string
  products: OrderProduct[]
  trade_no: number
  amount: number
  address: string
  status: string
  updated: Date
  user: User
  createdAt: string
}
