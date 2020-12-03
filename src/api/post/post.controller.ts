import express from 'express'
import { injectable, inject } from 'inversify'
import { RegistrableController } from '../registrable.controller'
import { PostModel } from '../../domain/interface'
import PostValidator from './post.validator'
import ApiResponse from '../../utilities/api-response'
import logger from '../../utilities/logger'
import { PostService } from '../../service/post.service'
import TYPES from '../../types'
import AuthGuard from '../../middleware/auth-guard'

@injectable()
export default class PostController implements RegistrableController {
  private postService: PostService

  constructor(@inject(TYPES.PostService) postService: PostService) {
    this.postService = postService
  }

  registerRoutes(app: express.Application): void {
    app.post('/api/post', AuthGuard, this.createOne)
    app.post('/api/post/signin')
    app.post('/api/post/signout')
    app.get('/api/post/authorise')
  }

  createOne = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
      const model: PostModel = {
        ...req.body,
        // set user id using JWT token passed in header
        postedBy: req.user?._id
      }

      // validate request body
      const validity = PostValidator.createOne(model)
      if (validity.error) {
        const { message } = validity.error
        return ApiResponse.error(res, message)
      }

      const post = await this.postService.createOne(model)

      return ApiResponse.success(res,  { post })

    } catch (error) {
      const { message } = error
      logger.error(`[PostController: createOne] - Unable to create post: ${message}`)
      return ApiResponse.error(res, message)
    }
  }
}
