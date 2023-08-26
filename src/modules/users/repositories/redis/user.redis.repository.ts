import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaClientTransaction } from '../../../../config/prisma/prisma.interface'
import { RedisService } from '../../../../config/redis/redis.service'
import { filterOptions } from '../../../../utils/filter-options-repository.utils'
import { whereGenerator } from '../../../../utils/where-generator.utils'
import { UserEntity } from '../../entities/user.entity'
import {
  IFindOptions,
  IPaginationOptions
} from '../../interfaces/options.interface'
import { UserRepository } from '../user.repository'

@Injectable()
export class UserRedisRepository implements UserRepository {
  constructor(
    private readonly redis: RedisService,
    private readonly repository: UserRepository
  ) {}

  private include = {
    Address: true,
    Purchases: true,
    Assessments: true,
    Permissions: { where: { deletedAt: null, disabledAt: null } },
    Conversations: true
  }

  async createUser(
    tx: PrismaClientTransaction,
    data: Prisma.UserUncheckedCreateInput
  ): Promise<UserEntity> {
    const user = await this.repository.createUser(tx, data)

    await this.redis.del('users')

    await this.redis.set(user.id, JSON.stringify(user))

    return user
  }

  async updateUserById(
    tx: PrismaClientTransaction,
    id: string,
    data: Prisma.UserUncheckedUpdateInput
  ): Promise<UserEntity> {
    const user = await this.repository.updateUserById(tx, id, data)

    await this.redis.del('users')

    await this.redis.set(user.id, JSON.stringify(user))

    return user
  }

  async findUserByEmail(
    tx: PrismaClientTransaction,
    email: string,
    options: IFindOptions
  ): Promise<UserEntity | null> {
    let user: UserEntity

    const cached = await this.redis.get('users')

    if (cached) {
      const users: UserEntity[] = JSON.parse(cached)
      user = filterOptions(users, options).find(
        (user: UserEntity) => user.email === email
      )
    } else {
      user = await this.repository.findUserByEmail(tx, email, options)
    }

    if (user) {
      await this.redis.set(user.id, JSON.stringify(user))
    }

    return user
  }

  async findUserByLogin(
    tx: PrismaClientTransaction,
    login: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    let user: UserEntity

    const cached = await this.redis.get('users')

    if (cached) {
      const users: UserEntity[] = JSON.parse(cached)

      const usersFind = users.find((user) => user.login === login)

      user = filterOptions(Array(usersFind), options)[0]
    } else {
      user = await this.repository.findUserByLogin(tx, login, options)
    }

    if (user) {
      await this.redis.set(user.id, JSON.stringify(user))
    }

    return user
  }

  async findUserById(
    tx: PrismaClientTransaction,
    id: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    let user: UserEntity

    const cachedUser = await this.redis.get(id)

    if (cachedUser) {
      return JSON.parse(cachedUser)
    }

    const cached = await this.redis.get('users')

    if (cached) {
      const users: UserEntity[] = JSON.parse(cached)

      user = filterOptions(users, options).find(
        (user: UserEntity) => user.id === id
      )
    } else {
      user = await tx.user.findFirst({
        where: { ...whereGenerator(options), id },
        include: this.include
      })
    }

    if (user) {
      await this.redis.set(user.id, JSON.stringify(user))
    }

    return user
  }

  async countUsers(
    tx: PrismaClientTransaction,
    options: IPaginationOptions
  ): Promise<number> {
    return await tx.user.count({ where: { ...whereGenerator(options) } })
  }

  async findAllUsersForPagination(
    tx: PrismaClientTransaction,
    { skip, take, ...options }: IPaginationOptions
  ): Promise<UserEntity[]> {
    let users: UserEntity[] = []

    const cached = await this.redis.get('users')

    if (cached) {
      users = JSON.parse(cached)
    } else {
      users = await tx.user.findMany({ include: this.include })
    }

    await this.redis.set('users', JSON.stringify(users))

    return filterOptions(users, options)

    // return await tx.user.findMany({
    //   where: { ...whereGenerator(options) },
    //   skip,
    //   take,
    //   include: this.include
    // })
  }

  async disableUserById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<UserEntity> {
    const user = await tx.user.update({
      where: { id },
      data: { disabledAt: new Date() },
      include: this.include
    })

    await this.redis.del('users')

    await this.redis.set(user.id, JSON.stringify(user))

    return user
  }

  async enableUserById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<UserEntity> {
    const user = await tx.user.update({
      where: { id },
      data: { disabledAt: null },
      include: this.include
    })

    await this.redis.del('users')

    await this.redis.set(user.id, JSON.stringify(user))

    return user
  }

  async deleteUserById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<UserEntity> {
    const user = await tx.user.update({
      where: { id },
      data: { disabledAt: new Date(), deletedAt: new Date() },
      include: this.include
    })

    await this.redis.del('users')

    await this.redis.set(user.id, JSON.stringify(user))

    return user
  }

  async findAllUsers(
    tx: PrismaClientTransaction,
    options: IFindOptions
  ): Promise<UserEntity[]> {
    let users: UserEntity[] = []

    const cached = await this.redis.get('users')

    if (cached) {
      users = JSON.parse(cached)
    } else {
      users = await tx.user.findMany({ include: this.include })
    }

    await this.redis.set('users', JSON.stringify(users))

    return filterOptions(users, options)
  }
}
