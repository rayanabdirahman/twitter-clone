import * as Joi from 'joi'
import { SignInModel, SignUpModel } from '../../domain/interface'

export default class UserValidator {  
  static signUpSchema: Joi.ObjectSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    avatar: Joi.string().required(),
    password: Joi.string().min(6).max(15).required(),
  })

  static signUp(model: SignUpModel): Joi.ValidationResult {
    return this.signUpSchema.validate(model)
  }

  static signInSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required()
  })

  static signIn(model: SignInModel): Joi.ValidationResult {
    return this.signInSchema.validate(model)
  }
}