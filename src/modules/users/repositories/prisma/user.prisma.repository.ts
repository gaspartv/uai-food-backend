import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaClientTransaction } from '../../../../config/prisma/prisma.interface'
import { whereGenerator } from '../../../../utils/where-generator.utils'
import { UserEntity } from '../../entities/user.entity'
import {
  IFindOptions,
  IPaginationOptions
} from '../../interfaces/options.interface'
import { UserRepository } from '../user.repository'

@Injectable()
export class UserPrismaRepository implements UserRepository {
  async createUser(
    tx: PrismaClientTransaction,
    data: Prisma.UserUncheckedCreateInput
  ): Promise<UserEntity> {
    return await tx.user.create({
      data,
      include: {
        Address: true,
        Purchases: true,
        Assessments: true,
        Permissions: { where: { deletedAt: null, disabledAt: null } },
        Conversations: true
      }
    })
  }

  async updateUserById(
    tx: PrismaClientTransaction,
    id: string,
    data: Prisma.UserUncheckedUpdateInput
  ): Promise<UserEntity> {
    return await tx.user.update({
      where: { id },
      data,
      include: {
        Address: true,
        Purchases: true,
        Assessments: true,
        Permissions: { where: { deletedAt: null, disabledAt: null } },
        Conversations: true
      }
    })
  }

  async findUserByEmail(
    tx: PrismaClientTransaction,
    email: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    return await tx.user.findFirst({
      where: { ...whereGenerator(options), email },
      include: {
        Address: true,
        Purchases: true,
        Assessments: true,
        Permissions: { where: { deletedAt: null, disabledAt: null } },
        Conversations: true
      }
    })
  }

  async findUserByLogin(
    tx: PrismaClientTransaction,
    login: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    return await tx.user.findFirst({
      where: { ...whereGenerator(options), login },
      include: {
        Address: true,
        Purchases: true,
        Assessments: true,
        Permissions: { where: { deletedAt: null, disabledAt: null } },
        Conversations: true
      }
    })
  }

  async findUserById(
    tx: PrismaClientTransaction,
    id: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    return await tx.user.findFirst({
      where: { ...whereGenerator(options), id },
      include: {
        Address: true,
        Purchases: true,
        Assessments: true,
        Permissions: { where: { deletedAt: null, disabledAt: null } },
        Conversations: true
      }
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
    return await tx.user.findMany({
      where: { ...whereGenerator(options) },
      skip,
      take,
      include: {
        Address: true,
        Purchases: true,
        Assessments: true,
        Permissions: { where: { deletedAt: null, disabledAt: null } },
        Conversations: true
      }
    })
  }

  async findAllUsers(
    tx: PrismaClientTransaction,
    options: IFindOptions
  ): Promise<UserEntity[]> {
    return await tx.user.findMany({
      where: { ...whereGenerator(options) },
      include: {
        Address: true,
        Purchases: true,
        Assessments: true,
        Permissions: { where: { deletedAt: null, disabledAt: null } },
        Conversations: true
      }
    })
  }

  async disableUserById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<UserEntity> {
    return await tx.user.update({
      where: { id },
      data: { disabledAt: new Date() },
      include: {
        Address: true,
        Purchases: true,
        Assessments: true,
        Permissions: { where: { deletedAt: null, disabledAt: null } },
        Conversations: true
      }
    })
  }

  async enableUserById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<UserEntity> {
    return await tx.user.update({
      where: { id },
      data: { disabledAt: null },
      include: {
        Address: true,
        Purchases: true,
        Assessments: true,
        Permissions: { where: { deletedAt: null, disabledAt: null } },
        Conversations: true
      }
    })
  }

  async deleteUserById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<UserEntity> {
    return await tx.user.update({
      where: { id },
      data: { disabledAt: new Date(), deletedAt: new Date() },
      include: {
        Address: true,
        Purchases: true,
        Assessments: true,
        Permissions: { where: { deletedAt: null, disabledAt: null } },
        Conversations: true
      }
    })
  }
}
