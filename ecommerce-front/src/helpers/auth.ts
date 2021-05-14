import { Jwt } from "../store/models/auth"

export function isAuth(): boolean | Jwt {
  const jwt = localStorage.getItem("jwt")
  if (jwt) return JSON.parse(jwt)
  return false
}
