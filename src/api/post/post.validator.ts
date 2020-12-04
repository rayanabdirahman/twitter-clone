import Joi from 'joi'
import { PostLikeModel, PostModel } from '../../domain/interface'

export default class PostValidator {
  static createOneSchema: Joi.ObjectSchema = Joi.object({
    content: Joi.string().required(),
    postedBy: Joi.string().required()
  })

  static createOne(model: PostModel): Joi.ValidationResult {
    return this.createOneSchema.validate(model)
  }

  static likeOneSchema: Joi.ObjectSchema = Joi.object({
    _id: Joi.string().required(),
    user: Joi.object().required()
  })

  static likeOne(model: PostLikeModel): Joi.ValidationResult {
    return this.likeOneSchema.validate(model)
  }
}