import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PCTransaction } from '../../../../config/env/prisma/prisma.interface'
import { whereGenerator } from '../../../../utils/where-generator.utils'
import { UserEntity } from '../../entities/user.entity'
import {
  IFindOptions,
  IPaginationOptions
} from '../../interfaces/options.interface'
import { UserRepository } from '../user.repository'

@Injectable()
export class UserPrismaRepository implements UserRepository {
  private include = {
    Address: true,
    Purchases: true,
    Stars: true,
    StorePermissions: { where: { deletedAt: null, disabledAt: null } }
  }

  async createUser(
    tx: PCTransaction,
    data: Prisma.UserUncheckedCreateInput
  ): Promise<UserEntity> {
    const userCreate = await tx.user.create({ data })

    return await tx.user.update({
      where: { id: userCreate.id },
      data: { Address: { connect: { id: data.addressId } } },
      include: this.include
    })
  }

  async updateUserById(
    tx: PCTransaction,
    id: string,
    data: Prisma.UserUncheckedUpdateInput
  ): Promise<UserEntity> {
    return await tx.user.update({ where: { id }, data, include: this.include })
  }

  async findUserByEmail(
    tx: PCTransaction,
    email: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    const { deletedAt, disabledAt } = whereGenerator(options)

    return await tx.user.findFirst({
      where: { ...deletedAt, ...disabledAt, email },
      include: this.include
    })
  }

  async findUserByLogin(
    tx: PCTransaction,
    login: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    const { deletedAt, disabledAt } = whereGenerator(options)

    return await tx.user.findFirst({
      where: { ...deletedAt, ...disabledAt, login },
      include: this.include
    })
  }

  async findUserById(
    tx: PCTransaction,
    id: string,
    options: IFindOptions
  ): Promise<UserEntity> {
    const { deletedAt, disabledAt } = whereGenerator(options)

    return await tx.user.findFirst({
      where: { ...deletedAt, ...disabledAt, id },
      include: this.include
    })
  }

  async countUsers(
    tx: PCTransaction,
    { skip, take, ...options }: IPaginationOptions
  ): Promise<number> {
    const { deletedAt, disabledAt } = whereGenerator(options)

    return await tx.user.count({
      where: { ...deletedAt, ...disabledAt }
    })
  }

  async findAllUsersForPagination(
    tx: PCTransaction,
    { skip, take, ...options }: IPaginationOptions
  ): Promise<UserEntity[]> {
    const { deletedAt, disabledAt } = whereGenerator(options)

    return await tx.user.findMany({
      where: { ...deletedAt, ...disabledAt },
      skip,
      take,
      include: this.include
    })
  }

  async findAllUsers(
    tx: PCTransaction,
    options: IFindOptions
  ): Promise<UserEntity[]> {
    const { deletedAt, disabledAt } = whereGenerator(options)

    return await tx.user.findMany({
      where: { ...deletedAt, ...disabledAt },
      include: this.include
    })
  }

  async disableUserById(tx: PCTransaction, id: string): Promise<UserEntity> {
    return await tx.user.update({
      where: { id },
      data: { disabledAt: new Date() },
      include: this.include
    })
  }

  async enableUserById(tx: PCTransaction, id: string): Promise<UserEntity> {
    return await tx.user.update({
      where: { id },
      data: { disabledAt: null },
      include: this.include
    })
  }

  async deleteUserById(tx: PCTransaction, id: string): Promise<UserEntity> {
    return await tx.user.update({
      where: { id },
      data: { disabledAt: new Date(), deletedAt: new Date() },
      include: this.include
    })
  }
}
