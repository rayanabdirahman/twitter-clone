import { UserModel } from '../domain/interface'

declare global {
  namespace Express {
    interface Request {
      user?: UserModel
    }
  }
}
