import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PCTransaction } from '../../../../config/env/prisma/prisma.interface'
import { UserEntity } from '../../entities/user.entity'
import {
  IOptionsFind,
  IOptionsFindMany
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

  async findUserByEmail(tx: PCTransaction, email: string): Promise<UserEntity> {
    return await tx.user.findUnique({ where: { email }, include: this.include })
  }

  async findUserByLogin(tx: PCTransaction, login: string): Promise<UserEntity> {
    return await tx.user.findUnique({ where: { login }, include: this.include })
  }

  async findUserById(tx: PCTransaction, id: string): Promise<UserEntity> {
    return await tx.user.findFirst({
      where: { id, deletedAt: null },
      include: this.include
    })
  }

  async countUsers(
    tx: PCTransaction,
    { skip, take, ...options }: IOptionsFindMany
  ): Promise<number> {
    const disabledAt =
      options.disabledAt === true
        ? { NOT: { disabledAt: null } }
        : options.disabledAt === false
        ? { disabledAt: null }
        : { disabledAt: undefined }

    return await tx.user.count({
      where: { deletedAt: null, ...disabledAt }
    })
  }

  async findAllUsersForPagination(
    tx: PCTransaction,
    { skip, take, ...options }: IOptionsFindMany
  ): Promise<UserEntity[]> {
    const disabledAt =
      options.disabledAt === true
        ? { NOT: { disabledAt: null } }
        : options.disabledAt === false
        ? { disabledAt: null }
        : { disabledAt: undefined }

    return await tx.user.findMany({
      where: { deletedAt: null, ...disabledAt },
      skip,
      take,
      include: this.include
    })
  }

  async findAllUsers(
    tx: PCTransaction,
    options: IOptionsFind
  ): Promise<UserEntity[]> {
    const disabledAt =
      options.disabledAt === true
        ? { NOT: { disabledAt: null } }
        : options.disabledAt === false
        ? { disabledAt: null }
        : { disabledAt: undefined }

    return await tx.user.findMany({
      where: { deletedAt: null, ...disabledAt },
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
