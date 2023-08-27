import { Prisma } from '@prisma/client'
import { PrismaClientTransaction } from '../../../config/prisma/prisma.interface'
import {
  IFindOptions,
  IPaginationOptions
} from '../../users/interfaces/options.interface'
import {
  StoreEntity,
  StoreWithNotRelationsEntity,
  StoryClientEntity
} from '../entities/store.entity'

export abstract class StoreRepository {
  abstract createStore(
    tx: PrismaClientTransaction,
    data: Prisma.StoreUncheckedCreateInput
  ): Promise<StoreWithNotRelationsEntity>

  abstract updateStore(
    tx: PrismaClientTransaction,
    id: string,
    data: Prisma.StoreUncheckedUpdateInput
  ): Promise<StoreWithNotRelationsEntity>

  abstract findStoreById(
    tx: PrismaClientTransaction,
    id: string,
    options: IFindOptions
  ): Promise<StoreEntity>

  abstract findStoreByCorporateName(
    tx: PrismaClientTransaction,
    corporateName: string,
    options: IFindOptions
  ): Promise<StoreEntity>

  abstract findStoreByCNPJ(
    tx: PrismaClientTransaction,
    cnpj: string,
    options: IFindOptions
  ): Promise<StoreEntity>

  abstract findStoreByIdentifier(
    tx: PrismaClientTransaction,
    identifier: string,
    options: IFindOptions
  ): Promise<StoreEntity>

  abstract findAllStoresForPagination(
    tx: PrismaClientTransaction,
    options: IPaginationOptions
  ): Promise<StoryClientEntity[]>

  abstract findAllStores(
    tx: PrismaClientTransaction,
    options: IFindOptions
  ): Promise<StoryClientEntity[]>

  abstract disableStoreById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<StoreWithNotRelationsEntity>

  abstract enableStoreById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<StoreWithNotRelationsEntity>

  abstract deleteStoreById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<StoreWithNotRelationsEntity>
}
