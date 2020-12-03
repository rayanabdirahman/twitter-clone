import { injectable } from 'inversify'
import { PostModel } from '../../domain/interface'
import Post, { PostDocument } from '../model/post.model'

export interface PostRepository {
  createOne(model: PostModel): Promise<PostDocument>
}

@injectable()
export class PostRepositoryImpl implements PostRepository {
  /**
   * Create a single post
   * @param { PostModel } model - stores information needed to created a new post
   */
  async createOne(model: PostModel): Promise<PostDocument> {
    const post = new Post(model)
    return await post.save()
  }
}
