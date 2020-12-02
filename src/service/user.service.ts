import { injectable, inject } from 'inversify'
import { UserDocument } from '../database/model/user.model'

import { UserRepository } from '../database/repository/user.repository'
import { SignUpModel } from '../domain/interface'
import TYPES from '../types'
import JwtHelper from '../utilities/jwt-helper'
import logger from '../utilities/logger'

export interface UserService {
  signUp(model: SignUpModel): Promise<string>
}

@injectable()
export class UserServiceImpl implements UserService {
  private userRepository: UserRepository
  
  constructor(@inject(TYPES.UserRepository) userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  /**
   * Check if user email exists
   * @param { string } email - stores user email
   */
  private async isEmailTaken(email: string): Promise<boolean> {
    return await this.userRepository.findByEmail(email) ? Promise.resolve(true) : Promise.resolve(false)
  }

  /**
   * Check if username exists
   * @param { string } username - stores user username
   */
  private async isUsernameTaken(username: string): Promise<boolean> {
    return await this.userRepository.findByUsername(username) ? Promise.resolve(true) : Promise.resolve(false)
  }

  /**
   * Create a single user
   * @param { SignUpModel } model - stores information needed to created a new user
   */
  async signUp(model: SignUpModel): Promise<string> {
    try {

      // check if user email is taken
      if (await this.isEmailTaken(model.email)) {
        throw new Error('Email already in use')
      }

      // check if username is taken
      if (await this.isUsernameTaken(model.email)) {
        throw new Error('Username already in use')
      }
      
      const user = await this.userRepository.createOne(model)

      // sign JWT token
      return await JwtHelper.sign(user)

    } catch(error) {
      logger.error(`[UserService: signUp]: Unabled to create new user: ${error}`)
      throw error
    }
  }
}