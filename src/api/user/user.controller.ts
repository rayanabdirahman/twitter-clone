import express from 'express'
import { injectable, inject } from 'inversify'
import { RegistrableController } from '../registrable.controller'
import TYPES from '../../types'
import { SignInModel, SignUpModel, UserModel } from '../../domain/interface'
import UserValidator from './user.validator'
import ApiResponse from '../../utilities/api-response'
import { UserService } from '../../service/user.service'
import logger from '../../utilities/logger'
import AuthGuard from '../../middleware/auth-guard'
import { ResponseHeaderEnum } from '../../domain/enum'

@injectable()
export default class UserController implements RegistrableController {
  private userService: UserService

  constructor(@inject(TYPES.UserService) userService: UserService) {
    this.userService = userService
  }

  registerRoutes(app: express.Application): void {
    app.post('/api/user/signup', this.signUp)
    app.post('/api/user/signin', this.signIn)
    app.post('/api/user/signout', this.signOut)
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

      // store token in authorisation header
      res.header(ResponseHeaderEnum.AUTHORIZATION, `Bearer ${token}`)

      return ApiResponse.success(res,  { token })

    } catch (error) {
      const { message } = error
      logger.error(`[UserController: signup] - Unable to signup user: ${message}`)
      return ApiResponse.error(res, message)
    }
  }

  signIn = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
      const model: SignInModel = {
        ...req.body
      }

      // validate request body
      const validity = UserValidator.signIn(model)
      if (validity.error) {
        const { message } = validity.error
        return ApiResponse.error(res, message)
      }

      // generate JWT token
      const token = await this.userService.signIn(model)

      // store token in authorisation header
      res.header(ResponseHeaderEnum.AUTHORIZATION, `Bearer ${token}`)

      return ApiResponse.success(res,  { token })

    } catch (error) {
      const { message } = error
      logger.error(`[UserController: signIn] - Unable to sign in user: ${message}`)
      return ApiResponse.error(res, message)
    }
  }

  signOut = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
      // remove authorisation header
      delete req.headers[ResponseHeaderEnum.AUTHORIZATION]

      return ApiResponse.success(res, 'Successfully signed user out')

    } catch (error) {
      const { message } = error;
      logger.error(`[UserController: signOut] - Unable to sign out user: ${message}`);
      return ApiResponse.error(res, message);
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
