import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { PCTransaction } from '../../config/env/prisma/prisma.interface'
import { EnvService } from '../../config/env/service.env'
import { AddressesService } from '../addresses/addresses.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'
import {
  IFindOptions,
  IPaginationOptions
} from './interfaces/options.interface'
import { UserRepository } from './repositories/user.repository'

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly addressesService: AddressesService,
    private readonly envService: EnvService
  ) {}

  async createUser(
    tx: PCTransaction,
    { address, password, ...dto }: CreateUserDto
  ): Promise<UserEntity> {
    await this.verifyUserExistsByEmail(tx, dto.email, {
      deletedAt: undefined,
      disabledAt: undefined
    })
    await this.verifyUserExistsByLogin(tx, dto.login, {
      deletedAt: undefined,
      disabledAt: undefined
    })

    const addressCreate = await this.addressesService.create(tx, address)

    const password_hash = await hash(
      password,
      Number(this.envService.env.HASH_SALT)
    )

    return await this.userRepository.createUser(tx, {
      ...dto,
      password_hash,
      addressId: addressCreate.id
    })
  }

  async updateUserById(
    tx: PCTransaction,
    id: string,
    { address, password, ...dto }: UpdateUserDto
  ): Promise<UserEntity> {
    console.log(address)
    if (dto.email) {
      await this.verifyUserExistsByEmail(
        tx,
        dto.email,
        { deletedAt: undefined, disabledAt: undefined },
        id
      )
    }

    if (dto.login) {
      await this.verifyUserExistsByLogin(
        tx,
        dto.login,
        { deletedAt: undefined, disabledAt: undefined },
        id
      )
    }

    return await this.userRepository.updateUserById(tx, id, dto)
  }

  async countUsers(tx: PCTransaction, options: IPaginationOptions) {
    return await this.userRepository.countUsers(tx, options)
  }

  async findAllUsersForPagination(
    tx: PCTransaction,
    options: IPaginationOptions
  ) {
    return await this.userRepository.findAllUsersForPagination(tx, options)
  }

  async findAllUsers(tx: PCTransaction, options: IFindOptions) {
    return await this.userRepository.findAllUsers(tx, options)
  }

  async disableUserById(tx: PCTransaction, id: string) {
    return await this.userRepository.disableUserById(tx, id)
  }

  async enableUserById(tx: PCTransaction, id: string) {
    return await this.userRepository.enableUserById(tx, id)
  }

  async deleteUserById(tx: PCTransaction, id: string) {
    return await this.userRepository.deleteUserById(tx, id)
  }

  // VERIFY //

  async verifyUserExistsByEmail(
    tx: PCTransaction,
    email: string,
    options: IFindOptions,
    currentUserId?: string
  ) {
    const user = await this.findUserByEmail(tx, email, options)

    if (user && user.id !== currentUserId) {
      throw new ConflictException('Email already registered.')
    }
  }

  async verifyUserExistsByLogin(
    tx: PCTransaction,
    login: string,
    options: IFindOptions,
    currentUserId?: string
  ) {
    const user = await this.findUserByLogin(tx, login, options)

    if (user && user.id !== currentUserId) {
      throw new ConflictException('Login already registered.')
    }
  }

  async verifyUserExistsById(
    tx: PCTransaction,
    id: string,
    options: IFindOptions
  ) {
    if (await this.findUserById(tx, id, options)) {
      throw new ConflictException('ID already registered.')
    }
  }

  async findUserByEmailOrThrow(
    tx: PCTransaction,
    email: string,
    options: IFindOptions
  ) {
    const user = await this.findUserByEmail(tx, email, options)
    if (!user) throw new NotFoundException('User not found.')
    return user
  }

  async findUserByLoginOrThrow(
    tx: PCTransaction,
    login: string,
    options: IFindOptions
  ) {
    const user = await this.findUserByLogin(tx, login, options)
    if (!user) throw new NotFoundException('User not found.')
    return user
  }

  async findUserByIdOrThrow(
    tx: PCTransaction,
    id: string,
    options: IFindOptions
  ) {
    const user = await this.findUserById(tx, id, options)
    if (!user) throw new NotFoundException('User not found.')
    return user
  }

  async findUserByEmail(
    tx: PCTransaction,
    email: string,
    options: IFindOptions
  ) {
    return await this.userRepository.findUserByEmail(tx, email, options)
  }

  async findUserByLogin(
    tx: PCTransaction,
    login: string,
    options: IFindOptions
  ) {
    return await this.userRepository.findUserByLogin(tx, login, options)
  }

  async findUserById(tx: PCTransaction, id: string, options: IFindOptions) {
    return await this.userRepository.findUserById(tx, id, options)
  }
}
