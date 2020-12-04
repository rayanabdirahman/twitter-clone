import express from 'express'
import { injectable, inject } from 'inversify'
import { RegistrableController } from '../registrable.controller'
import { PostLikeModel, PostModel } from '../../domain/interface'
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
    app.put('/api/post/:_id/like', AuthGuard, this.likeOne)
    app.get('/api/post/list', this.findAll)
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

  likeOne = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
      const model: PostLikeModel = {
        _id: req.params._id,
        user: req.user!
      }

      // validate request body
      const validity = PostValidator.likeOne(model)
      if (validity.error) {
        const { message } = validity.error
        return ApiResponse.error(res, message)
      }

      const post = await this.postService.likeOne(model)

      return ApiResponse.success(res,  { post })
    } catch (error) {
      const { message } = error
      logger.error(`[PostController: likeOne] - Failed to like post: ${message}`)
      return ApiResponse.error(res, message)
    }
  }

  findAll = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
      const posts = await this.postService.findAll()
      return ApiResponse.success(res,  { posts })
    } catch (error) {
      const { message } = error
      logger.error(`[PostController: findAll] - Unable to find posts: ${message}`)
      return ApiResponse.error(res, message)
    }
  }
}
