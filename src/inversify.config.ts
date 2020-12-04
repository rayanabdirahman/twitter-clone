import 'reflect-metadata'
import { Container } from 'inversify'
import TYPES from './types'
import { RegistrableController } from './api/registrable.controller'
import UserController from './api/user/user.controller'
import { UserService, UserServiceImpl } from './service/user.service'
import { UserRepository, UserRepositoryImpl } from './database/repository/user.repository'
import PostController from './api/post/post.controller'
import { PostRepository, PostRepositoryImpl } from './database/repository/post.repository'
import { PostService, PostServiceImpl } from './service/post.service'
import ProfileController from './api/profile/profile.controller'
import { ProfileServiceImpl, ProfileService } from './service/profile.service'

const container = new Container()

// controllers
container.bind<RegistrableController>(TYPES.Controller).to(UserController)
container.bind<RegistrableController>(TYPES.Controller).to(PostController)
container.bind<RegistrableController>(TYPES.Controller).to(ProfileController)

// services
container.bind<UserService>(TYPES.UserService).to(UserServiceImpl)
container.bind<PostService>(TYPES.PostService).to(PostServiceImpl)
container.bind<ProfileService>(TYPES.ProfileService).to(ProfileServiceImpl)

// repository
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl)
container.bind<PostRepository>(TYPES.PostRepository).to(PostRepositoryImpl)

export default container