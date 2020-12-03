import Joi from 'joi'
import { PostModel } from '../../domain/interface'

export default class PostValidator {  
  static createOneSchema: Joi.ObjectSchema = Joi.object({
    content: Joi.string().required(),
    postedBy: Joi.string().required()
  })

  static createOne(model: PostModel): Joi.ValidationResult {
    return this.createOneSchema.validate(model)
  }
}