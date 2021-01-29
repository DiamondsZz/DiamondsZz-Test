import { call, put, takeEvery } from "redux-saga/effects";

function* countAdd(action) {
  yield put({ type: "add" });
}
export function* countSaga() {
  yield takeEvery("countAdd", countAdd);
}
