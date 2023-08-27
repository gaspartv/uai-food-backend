import { Injectable } from '@nestjs/common'
import { Prisma, Store } from '@prisma/client'
import { PrismaClientTransaction } from '../../../../config/prisma/prisma.interface'
import { RedisService } from '../../../../config/redis/redis.service'
import { filterOptions } from '../../../../utils/filter-options-repository.utils'
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
import { StorePrismaRepository } from '../prisma/stores.prisma.repository'
import { StoreRepository } from '../stores.repository'

@Injectable()
export class StoreRedisRepository implements StoreRepository {
  constructor(
    private readonly redis: RedisService,
    private readonly repository: StorePrismaRepository
  ) {}

  async createStore(
    tx: PrismaClientTransaction,
    data: Prisma.StoreUncheckedCreateInput
  ): Promise<StoreWithNotRelationsEntity> {
    const store = await this.repository.createStore(tx, data)

    await this.redis.del('stores')

    await this.redis.set(store.id, JSON.stringify(store))

    return store
  }

  async updateStore(
    tx: PrismaClientTransaction,
    id: string,
    data: Prisma.StoreUncheckedUpdateInput
  ): Promise<StoreWithNotRelationsEntity> {
    const store = await this.repository.updateStore(tx, id, data)

    await this.redis.del('stores')

    await this.redis.set(store.id, JSON.stringify(store))

    return store
  }

  async findStoreById(
    tx: PrismaClientTransaction,
    id: string,
    options: IFindOptions
  ): Promise<StoreEntity> {
    let store: StoreEntity

    const storesCached = await this.redis.get('stores')

    if (storesCached) {
      const stores: StoreEntity[] = JSON.parse(storesCached)
      store = filterOptions(stores, options).find(
        (store: Store) => store.id === id
      )
    } else {
      store = await this.repository.findStoreById(tx, id, options)
    }

    if (store) {
      await this.redis.set(store.id, JSON.stringify(store))
    }

    return store
  }

  async findStoreByCorporateName(
    tx: PrismaClientTransaction,
    corporateName: string,
    options: IFindOptions
  ): Promise<StoreEntity> {
    let store: StoreEntity

    const storesCached = await this.redis.get('stores')

    if (storesCached) {
      const stores: StoreEntity[] = JSON.parse(storesCached)
      store = filterOptions(stores, options).find(
        (store: Store) => store.corporateName === corporateName
      )
    } else {
      store = await this.repository.findStoreByCorporateName(
        tx,
        corporateName,
        options
      )
    }

    if (store) {
      await this.redis.set(store.id, JSON.stringify(store))
    }

    return store
  }

  async findStoreByCNPJ(
    tx: PrismaClientTransaction,
    cnpj: string,
    options: IFindOptions
  ): Promise<StoreEntity> {
    let store: StoreEntity

    const storesCached = await this.redis.get('stores')

    if (storesCached) {
      const stores: StoreEntity[] = JSON.parse(storesCached)
      store = filterOptions(stores, options).find(
        (store: Store) => store.cnpj === cnpj
      )
    } else {
      store = await this.repository.findStoreByCNPJ(tx, cnpj, options)
    }

    if (store) {
      await this.redis.set(store.id, JSON.stringify(store))
    }

    return store
  }

  async findStoreByIdentifier(
    tx: PrismaClientTransaction,
    identifier: string,
    options: IFindOptions
  ): Promise<StoreEntity> {
    let store: StoreEntity

    const storesCached = await this.redis.get('stores')

    if (storesCached) {
      const stores: StoreEntity[] = JSON.parse(storesCached)
      store = filterOptions(stores, options).find(
        (store: Store) => store.identifier === identifier
      )
    } else {
      store = await this.repository.findStoreByIdentifier(
        tx,
        identifier,
        options
      )
    }

    if (store) {
      await this.redis.set(store.id, JSON.stringify(store))
    }

    return store
  }

  async findAllStoresForPagination(
    tx: PrismaClientTransaction,
    { skip, take, ...options }: IPaginationOptions
  ): Promise<StoryClientEntity[]> {
    let stores: StoreWithNotRelationsEntity[]

    const storesCached = await this.redis.get('stores')

    if (storesCached) {
      stores = JSON.parse(storesCached)

      return filterOptions(stores, options)
    }

    stores = await tx.store.findMany()

    await this.redis.set('stores', JSON.stringify(stores))

    return await tx.store.findMany({
      where: { ...whereGenerator(options) },
      skip,
      take,
      include: {
        Address: true,
        Categories: true
      }
    })
  }

  async findAllStores(
    tx: PrismaClientTransaction,
    options: IFindOptions
  ): Promise<StoreEntity[]> {
    let stores: StoreEntity[]

    const storesCached = await this.redis.get('stores')

    if (storesCached) {
      stores = JSON.parse(storesCached)
    } else {
      stores = await tx.store.findMany({
        include: {
          Address: true,
          Purchases: true,
          Assessments: true,
          Categories: true,
          Permissions: true,
          Conversations: true
        }
      })
    }

    await this.redis.set('stores', JSON.stringify(stores))

    return filterOptions(stores, options)
  }

  async disableStoreById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<StoreWithNotRelationsEntity> {
    const store = await tx.store.update({
      where: { id },
      data: { disabledAt: new Date() }
    })

    await this.redis.del('stores')

    await this.redis.set(store.id, JSON.stringify(store))

    return store
  }

  async enableStoreById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<StoreWithNotRelationsEntity> {
    const store = await tx.store.update({
      where: { id },
      data: { disabledAt: null }
    })

    await this.redis.del('stores')

    await this.redis.set(store.id, JSON.stringify(store))

    return store
  }

  async deleteStoreById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<StoreWithNotRelationsEntity> {
    const store = await tx.store.update({
      where: { id },
      data: { disabledAt: new Date(), deletedAt: new Date() }
    })

    await this.redis.del('stores')

    await this.redis.set(store.id, JSON.stringify(store))

    return store
  }
}
