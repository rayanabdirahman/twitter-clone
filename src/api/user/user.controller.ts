import express from 'express'
import { injectable, inject } from 'inversify'

import { RegistrableController } from '../registrable.controller'
import TYPES from '../../types'
import { SignUpModel, UserModel } from '../../domain/interface'
import UserValidator from './user.validator'
import ApiResponse from '../../utilities/api-response'
import { UserService } from '../../service/user.service'
import logger from '../../utilities/logger'
import AuthGuard from '../../middleware/auth-guard'

@injectable()
export default class UserController implements RegistrableController {
  private userService: UserService

  constructor(@inject(TYPES.UserService) userService: UserService) {
    this.userService = userService
  }

  registerRoutes(app: express.Application): void {
    app.post('/api/user/signup', this.signUp)
    app.post('/api/user/signin', (req: express.Request, res: express.Response) => res.send("Signin"))
    app.post('/api/user/signout', (req: express.Request, res: express.Response) => res.send("Signout"))
    app.get('/api/user/authorise', AuthGuard, this.authorise)
  }

  signUp = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
      const model: SignUpModel = {
        ...req.body,
        // default user avatar
        avatar: `https://eu.ui-avatars.com/api/?name=${req.body.firstName}+${req.body.lastName}&background=random&bold=true&rounded=true`
      }

      // validate request body
      const validity = UserValidator.signUp(model)
      if (validity.error) {
        const { message } = validity.error
        return ApiResponse.error(res, message)
      }

      const token = await this.userService.signUp(model)

      return ApiResponse.success(res,  { token })

    } catch (error) {
      const { message } = error
      logger.error(`[UserController: signup] - Unable to signup user: ${message}`)
      return ApiResponse.error(res, message)
    }
  }

  private authorise = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
      const model: UserModel | undefined = req.user

      // return authenticated user
      const user = model

      return ApiResponse.success(res, { user })

    } catch (error) {
      const { message } = error
      logger.error(`[UserController: authorise] - Unable to authorise user: ${message}`)
      return ApiResponse.error(res, error)
    }
  }
}
