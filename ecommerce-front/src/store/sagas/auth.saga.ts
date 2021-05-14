import { put, takeEvery } from "redux-saga/effects"
import {
  SIGNUP,
  SignupAction,
  signupSuccess,
  signupFail
} from "../actions/auth.actions"
import axios from "axios"
import { API } from "../../config"
import {
  SIGNIN,
  SigninAction,
  signinSuccess,
  signinFail
} from "../actions/auth.actions"

function* hanleSignup(action: SignupAction) {
  try {
    yield axios.post(`${API}/signup`, action.payload)
    yield put(signupSuccess())
  } catch (error) {
    yield put(signupFail(error.response.data.error))
  }
}

function* handleSignin(action: SigninAction) {
  try {
    let response = yield axios.post(`${API}/signin`, action.payload)
    localStorage.setItem("jwt", JSON.stringify(response.data))
    yield put(signinSuccess())
  } catch (error) {
    yield put(signinFail(error.response.data.error))
  }
}

export default function* authSaga() {
  // 注册
  yield takeEvery(SIGNUP, hanleSignup)
  // 登录
  yield takeEvery(SIGNIN, handleSignin)
}
