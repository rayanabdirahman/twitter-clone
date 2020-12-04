export interface SignUpModel {
  firstName: string
  lastName: string
  username: string
  email: string
  avatar: string
  password: string
}

export interface SignInModel {
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
  likes?: string[]
}

export interface JwtPayload {
  user: UserModel
}

export interface PostModel {
  content: string
  postedBy: string
  likes?: string[]
}

export interface PostLikeModel {
  _id: string | object,
  user: UserModel
}