import { Price } from "../store/models/product"

const prices: Price[] = [
  {
    id: 0,
    name: "不限制价格",
    array: []
  },
  {
    id: 1,
    name: "1 - 50",
    array: [1, 50]
  },
  {
    id: 2,
    name: "51 - 100",
    array: [51, 100]
  },
  {
    id: 3,
    name: "101 - 150",
    array: [101, 150]
  },
  {
    id: 4,
    name: "151 - 200",
    array: [151, 200]
  },
  {
    id: 5,
    name: "201 - 500",
    array: [201, 500]
  }
]

export default prices
