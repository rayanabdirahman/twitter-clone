import { injectable } from 'inversify'
import { PostModel } from '../../domain/interface'
import Post, { PostDocument } from '../model/post.model'

export interface PostRepository {
  createOne(model: PostModel): Promise<PostDocument>
  findAll(): Promise<PostDocument[] | null>
}

@injectable()
export class PostRepositoryImpl implements PostRepository {
  async createOne(model: PostModel): Promise<PostDocument> {
    const post = new Post(model)
    return await post.save()
  }

  async findAll(): Promise<PostDocument[] | null> {
    return await Post.find({}).populate('postedBy', ['-password']).sort({ 'createdAt': -1 })
  }
}
