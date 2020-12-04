import { injectable, inject } from 'inversify'
import TYPES from '../types'
import logger from '../utilities/logger'
import { UserRepository } from '../database/repository/user.repository'
import { UserDocument } from '../database/model/user.model'

export interface ProfileService {
  findOne(_id: string): Promise<UserDocument>
}

@injectable()
export class ProfileServiceImpl implements ProfileService {
  private userRepository: UserRepository
  
  constructor(
    @inject(TYPES.UserRepository) userRepository: UserRepository
  ) {
    this.userRepository = userRepository
  }

  async findOne(_id: string): Promise<any> { 
    try {
      // find user by _id or username
      const user = await this.userRepository.findByUsername(_id)
      return user || this.userRepository.findById(_id)
    } catch(error) {
      logger.error(`[ProfileService: findOne]: Unable to find profile: ${error}`)
      throw error
    }
  }
}
