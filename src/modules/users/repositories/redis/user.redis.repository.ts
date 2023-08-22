import { Injectable } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaClientTransaction } from '../../../../config/prisma/prisma.interface'
import { RedisService } from '../../../../config/redis/redis.service'
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
    private readonly prisma: PrismaClient
  ) {}

  private include = {
    Address: true,
    Purchases: true,
    Stars: true,
    StorePermissions: { where: { deletedAt: null, disabledAt: null } }
  }

  async createUser(
    tx: PrismaClientTransaction,
    data: Prisma.UserUncheckedCreateInput
  ): Promise<UserEntity> {
    return await tx.user.create({ data, include: this.include })
  }

  async updateUserById(
    tx: PrismaClientTransaction,
    id: string,
    data: Prisma.UserUncheckedUpdateInput
  ): Promise<UserEntity> {
    return await tx.user.update({ where: { id }, data, include: this.include })
  }

  async findUserByEmail(
    tx: PrismaClientTransaction,
    email: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    return await tx.user.findFirst({
      where: { ...whereGenerator(options), email },
      include: this.include
    })
  }

  async findUserByLogin(
    tx: PrismaClientTransaction,
    login: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    return await tx.user.findFirst({
      where: { ...whereGenerator(options), login },
      include: this.include
    })
  }

  async findUserById(
    tx: PrismaClientTransaction,
    id: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    return await tx.user.findFirst({
      where: { ...whereGenerator(options), id },
      include: this.include
    })
  }

  async countUsers(
    tx: PrismaClientTransaction,
    options: IPaginationOptions
  ): Promise<number> {
    return await tx.user.count({
      where: { ...whereGenerator(options) }
    })
  }

  async findAllUsersForPagination(
    tx: PrismaClientTransaction,
    { skip, take, ...options }: IPaginationOptions
  ): Promise<UserEntity[]> {
    const cached =
      'findAllUsersForPagination' + options.deletedAt + options.disabledAt

    const cachedUsers = await this.redis.get(`${cached}`)

    if (!cachedUsers) {
      const users = await tx.user.findMany({
        where: { ...whereGenerator(options) },
        skip,
        take,
        include: this.include
      })

      await this.redis.set(`${cached}`, JSON.stringify(users))

      return users
    }

    return JSON.parse(cachedUsers)
  }

  async disableUserById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<UserEntity> {
    return await tx.user.update({
      where: { id },
      data: { disabledAt: new Date() },
      include: this.include
    })
  }

  async enableUserById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<UserEntity> {
    return await tx.user.update({
      where: { id },
      data: { disabledAt: null },
      include: this.include
    })
  }

  async deleteUserById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<UserEntity> {
    return await tx.user.update({
      where: { id },
      data: { disabledAt: new Date(), deletedAt: new Date() },
      include: this.include
    })
  }

  async findAllUsers(
    tx: PrismaClientTransaction,
    options: IFindOptions
  ): Promise<UserEntity[]> {
    const cachedUsers = await this.redis.get('users')

    if (!cachedUsers) {
      console.log('sem cache')
      // return await this.prisma.findAllUsers(tx, options)
    }
    console.log('com cache')

    return JSON.parse(cachedUsers)
  }
}
