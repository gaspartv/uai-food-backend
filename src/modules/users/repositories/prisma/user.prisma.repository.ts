import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  IOptionsFind,
  IOptionsFindMany
} from '../../../../common/interfaces/options-repository.interface'
import { PCTransaction } from '../../../../config/env/prisma/prisma.interface'
import { UserEntity } from '../../entities/user.entity'
import { UserRepository } from '../user.repository'

@Injectable()
export class UserPrismaRepository implements UserRepository {
  private include = {
    Address: true,
    Purchases: true,
    Stars: true,
    StorePermissions: { where: { deletedAt: null, disabledAt: null } }
  }

  async create(
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

  async update(
    tx: PCTransaction,
    id: string,
    data: Prisma.UserUncheckedUpdateInput
  ): Promise<UserEntity> {
    return await tx.user.update({ where: { id }, data, include: this.include })
  }

  async find(
    tx: PCTransaction,
    id: string,
    options: IOptionsFind
  ): Promise<UserEntity> {
    const disabledAt =
      options.disabledAt === true
        ? { NOT: { disabledAt: null } }
        : options.disabledAt === false
        ? { disabledAt: null }
        : { disabledAt: undefined }

    return await tx.user.findFirstOrThrow({
      where: { id, deletedAt: null, ...disabledAt },
      include: this.include
    })
  }

  async findAllPagination(
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

  async findAll(
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

  async disable(tx: PCTransaction, id: string): Promise<UserEntity> {
    return await tx.user.update({
      where: { id },
      data: { disabledAt: new Date() },
      include: this.include
    })
  }

  async enable(tx: PCTransaction, id: string): Promise<UserEntity> {
    return await tx.user.update({
      where: { id },
      data: { disabledAt: null },
      include: this.include
    })
  }

  async delete(tx: PCTransaction, id: string): Promise<UserEntity> {
    return await tx.user.update({
      where: { id },
      data: { disabledAt: new Date(), deletedAt: new Date() },
      include: this.include
    })
  }
}
