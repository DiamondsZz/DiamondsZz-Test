/**
 * 注册
 */
export const SIGNUP = "SIGNUP"
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS"
export const SIGNUP_FAIL = "SIGNUP_FAIL"
export const RESET_SIGNUP = "RESET_SIGNUP"

export interface SignupPayload {
  email: string
  name: string
  password: string
}

export interface SignupAction {
  type: typeof SIGNUP
  payload: SignupPayload
}

export interface SignupSuccessAction {
  type: typeof SIGNUP_SUCCESS
}

export interface SignupFailAction {
  type: typeof SIGNUP_FAIL
  message: string
}

export interface ResetSignupAction {
  type: typeof RESET_SIGNUP
}

export const signup = (payload: SignupPayload): SignupAction => ({
  type: SIGNUP,
  payload
})

export const signupSuccess = (): SignupSuccessAction => ({
  type: SIGNUP_SUCCESS
})

export const signupFail = (message: string): SignupFailAction => ({
  type: SIGNUP_FAIL,
  message
})

export const resetSignup = (): ResetSignupAction => ({
  type: RESET_SIGNUP
})

/**
 * 登录
 */

export const SIGNIN = "SIGNIN"
export const SIGNIN_SUCCESS = "SIGNIN_SUCCESS"
export const SIGNIN_FAIL = "SIGNIN_FAIL"

export interface SigninPayload {
  email: string
  password: string
}

export interface SigninAction {
  type: typeof SIGNIN
  payload: SigninPayload
}

export interface SigninSuccessAction {
  type: typeof SIGNIN_SUCCESS
}

export interface SigninFailAction {
  type: typeof SIGNIN_FAIL
  message: string
}

export const signin = (payload: SigninPayload): SigninAction => ({
  type: SIGNIN,
  payload
})

export const signinSuccess = (): SigninSuccessAction => ({
  type: SIGNIN_SUCCESS
})

export const signinFail = (message: string): SigninFailAction => ({
  type: SIGNIN_FAIL,
  message
})

export type AuthUnionType =
  | SignupAction
  | SignupSuccessAction
  | SignupFailAction
  | ResetSignupAction
  | SigninAction
  | SigninSuccessAction
  | SigninFailAction
