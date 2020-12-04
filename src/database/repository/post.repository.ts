import { injectable } from 'inversify'
import { PostModel } from '../../domain/interface'
import Post, { PostDocument } from '../model/post.model'

export interface PostRepository {
  createOne(model: PostModel): Promise<PostDocument>
  findAll(): Promise<PostDocument[] | null>
  findByIdAndUpdate(_id: string | object, key: string, value: string | object, option?: string): Promise<PostDocument | null>
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

  async findByIdAndUpdate(_id: string | object, key: string, value: string | object, option?: string): Promise<PostDocument | null> {
    // give function flexibility to add or remove values from arrays
    // check if array key is being updated
    if (option) return await Post.findByIdAndUpdate(_id, {[ option ]: {[ key ]:  value }}, { 
      //@ts-ignore
      new: true
     })
    return await Post.findByIdAndUpdate(_id, { key: value }, {
      //@ts-ignore
      new: true
    })
  }
}
