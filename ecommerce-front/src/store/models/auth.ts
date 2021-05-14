export interface User {
  _id: string
  name: string
  email: string
  role: number
}

export interface Jwt {
  token: string
  user: User
}
