import { injectable } from 'inversify'
import { SignUpModel } from '../../domain/interface'
import User, { UserDocument } from '../model/user.model'

export interface UserRepository {
  createOne(model: SignUpModel): Promise<UserDocument>
  findByEmail(email: string, safeguard?: boolean): Promise<UserDocument | null>
  findById(_id: string, safeguard?: boolean): Promise<UserDocument | null>
  findByUsername(username: string): Promise<UserDocument | null>
  findByIdAndUpdate(_id: string | object, key: string, value: string | object, option?: string): Promise<UserDocument | null>
}

@injectable()
export class UserRepositoryImpl implements UserRepository {
  async createOne(model: SignUpModel): Promise<UserDocument> {
    const user = new User(model)
    return await user.save()
  }

  async findByEmail(email: string, safeguard: boolean = true): Promise<UserDocument | null> {
    // check if password should be returned with user document
    return safeguard ? await User.findOne({ email }).select('-password -__v') : await User.findOne({ email })
  }

  async findById(_id: string): Promise<UserDocument | null> {
    return await User.findOne({ _id }).select('-password -__v')
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return await User.findOne({ username }).select('-password -__v')
  }

  async findByIdAndUpdate(_id: string | object, key: string, value: string | object, option?: string): Promise<UserDocument | null> {
    // give function flexibility to add or remove values from arrays
    // check if array key is being updated
    if (option) return await User.findByIdAndUpdate(_id, {[ option ]: {[ key ]:  value }}, {
      //@ts-ignore
      new: true
    }).select('-password')
    return await User.findByIdAndUpdate(_id, { key: value }, {
      //@ts-ignore
      new: true
    }).select('-password')
  }
}
