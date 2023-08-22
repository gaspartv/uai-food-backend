import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { EnvService } from '../../config/env/service.env'
import { PrismaClientTransaction } from '../../config/prisma/prisma.interface'
import { AddressesService } from '../addresses/addresses.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'
import {
  IFindOptions,
  IPaginationOptions
} from './interfaces/options.interface'
import { UserRedisRepository } from './repositories/redis/user.redis.repository'

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRedisRepository,
    private readonly addressesService: AddressesService,
    private readonly envService: EnvService
  ) {}

  async createUser(
    tx: PrismaClientTransaction,
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
    tx: PrismaClientTransaction,
    id: string,
    sub: string,
    { address, password, ...dto }: UpdateUserDto
  ): Promise<UserEntity> {
    const user = await this.findUserById(tx, id, {
      deletedAt: false,
      disabledAt: false
    })

    if (!user || sub !== user.id) {
      throw new ForbiddenException('No permission to edit.')
    }

    if (dto.email) {
      await this.verifyUserExistsByEmail(
        tx,
        dto.email,
        { deletedAt: undefined, disabledAt: undefined },
        sub
      )
    }

    if (dto.login) {
      await this.verifyUserExistsByLogin(
        tx,
        dto.login,
        { deletedAt: undefined, disabledAt: undefined },
        sub
      )
    }

    return await this.userRepository.updateUserById(tx, id, dto)
  }

  async findAllUsersForPagination(
    tx: PrismaClientTransaction,
    options: IPaginationOptions
  ): Promise<UserEntity[]> {
    return await this.userRepository.findAllUsersForPagination(tx, options)
  }

  async disableUserById(
    tx: PrismaClientTransaction,
    id: string,
    sub: string
  ): Promise<UserEntity> {
    const user = await this.findUserByIdOrThrow(tx, id, {
      deletedAt: false,
      disabledAt: false
    })

    if (!user || sub !== user.id) {
      throw new ForbiddenException('No permission to edit.')
    }

    return await this.userRepository.disableUserById(tx, id)
  }

  async enableUserById(
    tx: PrismaClientTransaction,
    id: string,
    sub: string
  ): Promise<UserEntity> {
    const user = await this.findUserByIdOrThrow(tx, id, {
      deletedAt: false,
      disabledAt: undefined
    })

    if (!user || sub !== user.id) {
      throw new ForbiddenException('No permission to edit.')
    }

    return await this.userRepository.enableUserById(tx, id)
  }

  async deleteUserById(
    tx: PrismaClientTransaction,
    id: string,
    sub: string
  ): Promise<UserEntity> {
    const user = await this.findUserByIdOrThrow(tx, id, {
      deletedAt: false,
      disabledAt: false
    })

    if (!user || sub !== user.id) {
      throw new ForbiddenException('No permission to edit.')
    }

    return await this.userRepository.deleteUserById(tx, id)
  }

  // VERIFY //

  async findAllUsers(
    tx: PrismaClientTransaction,
    options: IFindOptions
  ): Promise<UserEntity[]> {
    return await this.userRepository.findAllUsers(tx, options)
  }

  async countUsers(
    tx: PrismaClientTransaction,
    options: IPaginationOptions
  ): Promise<number> {
    return await this.userRepository.countUsers(tx, options)
  }

  async verifyUserExistsByEmail(
    tx: PrismaClientTransaction,
    email: string,
    options: IFindOptions,
    currentUserId?: string
  ): Promise<void> {
    const user = await this.findUserByEmail(tx, email, options)

    if (user && user.id !== currentUserId) {
      throw new ConflictException('Email already registered.')
    }
  }

  async verifyUserExistsByLogin(
    tx: PrismaClientTransaction,
    login: string,
    options: IFindOptions,
    currentUserId?: string
  ): Promise<void> {
    const user = await this.findUserByLogin(tx, login, options)

    if (user && user.id !== currentUserId) {
      throw new ConflictException('Login already registered.')
    }
  }

  async verifyUserExistsById(
    tx: PrismaClientTransaction,
    id: string,
    options: IFindOptions
  ): Promise<void> {
    if (await this.findUserById(tx, id, options)) {
      throw new ConflictException('ID already registered.')
    }
  }

  async findUserByEmailOrThrow(
    tx: PrismaClientTransaction,
    email: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    const user = await this.findUserByEmail(tx, email, options)
    if (!user) throw new NotFoundException('User not found.')
    return user
  }

  async findUserByLoginOrThrow(
    tx: PrismaClientTransaction,
    login: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    const user = await this.findUserByLogin(tx, login, options)
    if (!user) throw new NotFoundException('User not found.')
    return user
  }

  async findUserByIdOrThrow(
    tx: PrismaClientTransaction,
    id: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    const user = await this.findUserById(tx, id, options)
    if (!user) throw new NotFoundException('User not found.')
    return user
  }

  async findUserByEmail(
    tx: PrismaClientTransaction,
    email: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    return await this.userRepository.findUserByEmail(tx, email, options)
  }

  async findUserByLogin(
    tx: PrismaClientTransaction,
    login: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    return await this.userRepository.findUserByLogin(tx, login, options)
  }

  async findUserById(
    tx: PrismaClientTransaction,
    id: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    return await this.userRepository.findUserById(tx, id, options)
  }
}
