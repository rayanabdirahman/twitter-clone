import { injectable, inject } from 'inversify'
import { PostRepository } from '../database/repository/post.repository'
import { PostDocument } from '../database/model/post.model'
import { PostLikeModel, PostModel, UserModel } from '../domain/interface'
import TYPES from '../types'
import logger from '../utilities/logger'
import { UserRepository } from '../database/repository/user.repository'

export interface PostService {
  createOne(model: PostModel): Promise<PostDocument>
  findAll(query: { [key: string]: string }): Promise<PostDocument[] | null>
  likeOne(model: PostLikeModel): Promise<void>
}

@injectable()
export class PostServiceImpl implements PostService {
  private postRepository: PostRepository
  private userRepository: UserRepository
  
  constructor(
    @inject(TYPES.PostRepository) postRepository: PostRepository,
    @inject(TYPES.UserRepository) userRepository: UserRepository
  ) {
    this.postRepository = postRepository
    this.userRepository = userRepository
  }

  private async hasUserLikedPost(model: PostLikeModel): Promise<boolean> {
    const user = await this.userRepository.findById(model.user._id as string)
    if(!user) {
      throw new Error('User cannot be found')
    }

    return user.likes.includes(model._id as any) ? Promise.resolve(true) : Promise.resolve(false)
  }

  async createOne(model: PostModel): Promise<PostDocument> {
    try {

      return await this.postRepository.createOne(model)

    } catch(error) {
      logger.error(`[PostService: createOne]: Unabled to create new post: ${error}`)
      throw error
    }
  }

  async findAll(query: { [key: string]: string }): Promise<PostDocument[] | null> { 
    try {
      // return all posts or filter by postedBy
      const posts = await this.postRepository.findAll(query)
      console.log('POSRS: ', posts)
      return posts
    } catch(error) {
      logger.error(`[PostService: findAll]: Unable to find posts: ${error}`)
      throw error
    }
  }

  async likeOne(model: PostLikeModel): Promise<any> { 
    try {
      const userHasLiked = await this.hasUserLikedPost(model)

      // update likes array for user by adding post id
      await this.userRepository.findByIdAndUpdate(model.user._id, 'likes', model._id, userHasLiked ? '$pull' : '$addToSet')

      // update likes array for post by adding user id
      return await this.postRepository.findByIdAndUpdate(model._id, 'likes', model.user._id, userHasLiked ? '$pull' : '$addToSet')

    } catch(error) {
      logger.error(`[PostService: likeOne]: Unable to like post: ${error}`)
      throw error
    }
  }
}
