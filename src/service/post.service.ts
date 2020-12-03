import { injectable, inject } from 'inversify'
import { PostRepository } from '../database/repository/post.repository'
import { PostDocument } from '../database/model/post.model'
import { PostModel } from '../domain/interface'
import TYPES from '../types'
import logger from '../utilities/logger'

export interface PostService {
  createOne(model: PostModel): Promise<PostDocument>
  findAll(): Promise<PostDocument[] | null>
}

@injectable()
export class PostServiceImpl implements PostService {
  private postRepository: PostRepository
  
  constructor(@inject(TYPES.PostRepository) postRepository: PostRepository) {
    this.postRepository = postRepository
  }

  async createOne(model: PostModel): Promise<PostDocument> {
    try {

      return await this.postRepository.createOne(model)

    } catch(error) {
      logger.error(`[PostService: createOne]: Unabled to create new post: ${error}`)
      throw error
    }
  }

  async findAll(): Promise<PostDocument[] | null> { 
    try {
      return await this.postRepository.findAll()
    } catch(error) {
      logger.error(`[PostService: findAll]: Unable to find posts: ${error}`)
      throw error
    }
  }
}