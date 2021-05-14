import { put, take, takeEvery } from "redux-saga/effects"
import {
  GET_PRODUCT,
  GetProductAction,
  getProductSuccess
} from "../actions/product.actions"
import axios from "axios"
import { API } from "../../config"
import { Product } from "../models/product"
import { getProductByIdSuccess } from "../actions/product.actions"
import {
  GET_PRODUCT_BY_ID,
  GetProductByIdAction
} from "../actions/product.actions"
import {
  FilterProductAction,
  filterProductSuccess
} from "../actions/product.actions"
import {
  SearchProductSuccess,
  FILTER_PRODUCT
} from "../actions/product.actions"
import {
  SEARCH_PRODUCT,
  SearchProductAction
} from "../actions/product.actions"

// /products?sortBy=createdAt&order=asc&limit=10
function* handleGetProduct({ sortBy, order, limit }: GetProductAction) {
  let response = yield axios.get<Product[]>(`${API}/products`, {
    params: { sortBy, order, limit }
  })
  yield put(getProductSuccess(response.data, sortBy))
}

function* handleSearchProduct({
  payload: { search, category }
}: SearchProductAction) {
  let response = yield axios.get(`${API}/products/search`, {
    params: { search, category }
  })
  yield put(SearchProductSuccess(response.data))
}

function* handleFilterProduct(action: FilterProductAction) {
  let response = yield axios.post(`${API}/products/filter`, action.payload)
  yield put(filterProductSuccess(response.data, action.payload.skip))
}

function* handleGetProductById({ payload }: GetProductByIdAction) {
  let response = yield axios.get(`${API}/product/${payload.productId}`)
  yield put(getProductByIdSuccess(response.data))
}

export default function* productSaga() {
  yield takeEvery(GET_PRODUCT, handleGetProduct)
  yield takeEvery(SEARCH_PRODUCT, handleSearchProduct)
  yield takeEvery(FILTER_PRODUCT, handleFilterProduct)
  yield takeEvery(GET_PRODUCT_BY_ID, handleGetProductById)
}
