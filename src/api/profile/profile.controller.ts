import express from 'express'
import { injectable, inject } from 'inversify'
import { RegistrableController } from '../registrable.controller'
import ApiResponse from '../../utilities/api-response'
import logger from '../../utilities/logger'
import { ProfileService } from '../../service/profile.service'
import TYPES from '../../types'
import AuthGuard from '../../middleware/auth-guard'

@injectable()
export default class ProfileController implements RegistrableController {
  private profileService: ProfileService

  constructor(@inject(TYPES.ProfileService) profileService: ProfileService) {
    this.profileService = profileService
  }

  registerRoutes(app: express.Application): void {
    app.get('/api/profile', AuthGuard, this.getCurrentUserProfile)
    app.get('/api/profile/:_id/', this.findOne)
  }

  getCurrentUserProfile = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
      const { _id } = req.user!

      // find current users profile
      const user = await this.profileService.findOne(_id as string)

      const profile = { user }

      return ApiResponse.success(res,  { profile })
    } catch (error) {
      const { message } = error
      logger.error(`[ProfileController: findOneByUsername] - Unable to find profile: ${message}`)
      return ApiResponse.error(res, message)
    }
  }

  findOne = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
      const { _id } = req.params

      // find one by _id or username
      const user = await this.profileService.findOne(_id)

      const profile = { user }

      return ApiResponse.success(res,  { profile })
    } catch (error) {
      const { message } = error
      logger.error(`[ProfileController: findOneByUsername] - Unable to find profile: ${message}`)
      return ApiResponse.error(res, message)
    }
  }
}
