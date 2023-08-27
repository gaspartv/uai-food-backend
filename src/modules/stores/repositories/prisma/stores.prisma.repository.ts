import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaClientTransaction } from '../../../../config/prisma/prisma.interface'
import { whereGenerator } from '../../../../utils/where-generator.utils'
import {
  IFindOptions,
  IPaginationOptions
} from '../../../users/interfaces/options.interface'
import {
  StoreEntity,
  StoreWithNotRelationsEntity,
  StoryClientEntity
} from '../../entities/store.entity'
import { StoreRepository } from '../stores.repository'

@Injectable()
export class StorePrismaRepository implements StoreRepository {
  private includeAll = {
    Address: true,
    Assessments: true,
    Categories: true,
    Conversations: true,
    Permissions: true,
    Purchases: true
  }

  private includeClient = {
    Address: true,
    Categories: true
  }

  async createStore(
    tx: PrismaClientTransaction,
    data: Prisma.StoreUncheckedCreateInput
  ): Promise<StoreWithNotRelationsEntity> {
    return await tx.store.create({ data })
  }

  async updateStore(
    tx: PrismaClientTransaction,
    id: string,
    data: Prisma.StoreUncheckedUpdateInput
  ): Promise<StoreWithNotRelationsEntity> {
    return await tx.store.update({ where: { id }, data })
  }

  async findStoreById(
    tx: PrismaClientTransaction,
    id: string,
    options: IFindOptions
  ): Promise<StoreEntity> {
    return await tx.store.findUnique({
      where: { id, ...whereGenerator(options) },
      include: this.includeAll
    })
  }

  async findStoreByCorporateName(
    tx: PrismaClientTransaction,
    corporateName: string,
    options: IFindOptions
  ): Promise<StoreEntity> {
    return await tx.store.findUnique({
      where: { corporateName, ...whereGenerator(options) },
      include: this.includeAll
    })
  }

  async findStoreByCNPJ(
    tx: PrismaClientTransaction,
    cnpj: string,
    options: IFindOptions
  ): Promise<StoreEntity> {
    return await tx.store.findUnique({
      where: { cnpj, ...whereGenerator(options) },
      include: this.includeAll
    })
  }

  async findStoreByIdentifier(
    tx: PrismaClientTransaction,
    identifier: string,
    options: IFindOptions
  ): Promise<StoreEntity> {
    return await tx.store.findFirst({
      where: { identifier, ...whereGenerator(options) },
      include: this.includeAll
    })
  }

  async findAllStoresForPagination(
    tx: PrismaClientTransaction,
    options: IPaginationOptions
  ): Promise<StoryClientEntity[]> {
    return await tx.store.findMany({
      where: { ...whereGenerator(options) },
      include: this.includeClient
    })
  }

  async findAllStores(
    tx: PrismaClientTransaction,
    options: IFindOptions
  ): Promise<StoryClientEntity[]> {
    return await tx.store.findMany({
      where: { ...whereGenerator(options) },
      include: this.includeClient
    })
  }

  async disableStoreById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<StoreWithNotRelationsEntity> {
    return await tx.store.update({
      where: { id },
      data: { disabledAt: new Date() }
    })
  }

  async enableStoreById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<StoreWithNotRelationsEntity> {
    return await tx.store.update({
      where: { id },
      data: { disabledAt: null }
    })
  }

  async deleteStoreById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<StoreWithNotRelationsEntity> {
    return await tx.store.update({
      where: { id },
      data: { disabledAt: new Date(), deletedAt: new Date() }
    })
  }
}
