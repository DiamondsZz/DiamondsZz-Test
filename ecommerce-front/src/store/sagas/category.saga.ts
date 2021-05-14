import { takeEvery, put } from "redux-saga/effects"
import { GET_CATEGORY, getCategorySuccess } from "../actions/category.actions"
import axios from "axios"
import { API } from "../../config"
import { Category } from "../models/category"

function* handleGetCategory() {
  let response = yield axios.get<Category[]>(`${API}/categories`)
  yield put(getCategorySuccess(response.data))
}

export default function* categorySaga() {
  // 获取分类列表
  yield takeEvery(GET_CATEGORY, handleGetCategory)
}
