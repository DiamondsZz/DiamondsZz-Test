import { call, put, takeEvery } from "redux-saga/effects";

function* count(action) {
  switch (action.actionType) {
    case "add":
      yield put({ type: "add" });
      break;
    case "reduce":
      yield put({ type: "reduce" });
      break;
  }
}
export function* numSaga() {
  yield takeEvery("count", count);
}
