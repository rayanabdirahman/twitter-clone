import 'reflect-metadata'
import { Container } from 'inversify'
import TYPES from './types'
import { RegistrableController } from './api/registrable.controller'
import UserController from './api/user/user.controller'
import { UserService, UserServiceImpl } from './service/user.service'
import { UserRepository, UserRepositoryImpl } from './database/repository/user.repository'

const container = new Container()

// controllers
container.bind<RegistrableController>(TYPES.Controller).to(UserController)

// services
container.bind<UserService>(TYPES.UserService).to(UserServiceImpl)

// repository
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl)

export default container