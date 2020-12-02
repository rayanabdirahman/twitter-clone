export interface SignUpModel {
  firstName: string
  lastName: string
  username: string
  email: string
  avatar: string
  password: string
}

export interface LoginModel {
  username: string
  email: string
  password: string
}

export interface UserModel {
  _id: string | object
  firstName: string
  lastName: string
  username: string
  email: string
  avatar: string
}

export interface JwtPayload {
  user: UserModel
}