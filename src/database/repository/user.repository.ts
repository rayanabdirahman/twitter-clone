import { injectable } from 'inversify'

import { SignUpModel } from '../../domain/interface'
import User, { UserDocument } from '../model/user.model'

export interface UserRepository {
  createOne(model: SignUpModel): Promise<UserDocument>
  findByEmail(email: string, safeguard?: boolean): Promise<UserDocument | null>
  findById(_id: string, safeguard?: boolean): Promise<UserDocument | null>
  findByUsername(username: string): Promise<UserDocument | null>
}

@injectable()
export class UserRepositoryImpl implements UserRepository {
  /**
   * Create a single user
   * @param { SignUpModel } model - stores information needed to created a new user
   */
  async createOne(model: SignUpModel): Promise<UserDocument> {
    const user = new User(model)
    return await user.save()
  }

  /**
   * Find user by email
   * @param { string } email - stores user email
   */
  async findByEmail(email: string ): Promise<UserDocument | null> {
    // check if password should be returned with user document
    return await User.findOne({ email }).select('-password -__v')
  }

  /**
   * Find user by id
   * @param { string } _id - stores user id
   */
  async findById(_id: string): Promise<UserDocument | null> {
    // check if password should be returned with user document
    return await User.findOne({ _id }).select('-password -__v')
  }

  /**
   * Find user by username
   * @param { string } username - stores user username
   */
  async findByUsername(username: string): Promise<UserDocument | null> {
    // check if password should be returned with user document
    return await User.findOne({ username }).select('-password -__v')
  }
}
