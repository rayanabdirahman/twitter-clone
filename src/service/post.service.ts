import { injectable, inject } from 'inversify'
import { PostRepository } from '../database/repository/post.repository'
import { PostDocument } from '../database/model/post.model'
import { PostModel } from '../domain/interface'
import TYPES from '../types'
import logger from '../utilities/logger'

export interface PostService {
  createOne(model: PostModel): Promise<PostDocument>
}

@injectable()
export class PostServiceImpl implements PostService {
  private postRepository: PostRepository
  
  constructor(@inject(TYPES.PostRepository) postRepository: PostRepository) {
    this.postRepository = postRepository
  }

  /**
   * Create a single post
   * @param { PostModel } model - stores information needed to created a new post
   */
  async createOne(model: PostModel): Promise<PostDocument> {
    try {

      return await this.postRepository.createOne(model)

    } catch(error) {
      logger.error(`[PostService: createOne]: Unabled to create new post: ${error}`)
      throw error
    }
  }
}