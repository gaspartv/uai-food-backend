import { Prisma } from '@prisma/client'
import {
  IOptionsFind,
  IOptionsFindMany
} from '../../../common/interfaces/options-repository.interface'
import { PCTransaction } from '../../../config/env/prisma/prisma.interface'
import { UserEntity } from '../entities/user.entity'

export abstract class UserRepository {
  abstract create(
    tx: PCTransaction,
    data: Prisma.UserUncheckedCreateInput
  ): Promise<UserEntity>

  abstract update(
    tx: PCTransaction,
    id: string,
    data: Prisma.UserUncheckedUpdateInput
  ): Promise<UserEntity>

  abstract find(
    tx: PCTransaction,
    id: string,
    options: IOptionsFind
  ): Promise<UserEntity>

  abstract findAllPagination(
    tx: PCTransaction,
    options: IOptionsFindMany
  ): Promise<UserEntity[]>

  abstract findAll(
    tx: PCTransaction,
    options: IOptionsFind
  ): Promise<UserEntity[]>

  abstract disable(tx: PCTransaction, id: string): Promise<UserEntity>

  abstract enable(tx: PCTransaction, id: string): Promise<UserEntity>

  abstract delete(tx: PCTransaction, id: string): Promise<UserEntity>
}
