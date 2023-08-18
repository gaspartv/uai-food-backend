import { Prisma } from '@prisma/client'
import { PCTransaction } from '../../../config/env/prisma/prisma.interface'
import { UserEntity } from '../entities/user.entity'
import {
  IFindOptions,
  IPaginationOptions
} from '../interfaces/options.interface'

export abstract class UserRepository {
  abstract createUser(
    tx: PCTransaction,
    data: Prisma.UserUncheckedCreateInput
  ): Promise<UserEntity>

  abstract updateUserById(
    tx: PCTransaction,
    id: string,
    data: Prisma.UserUncheckedUpdateInput
  ): Promise<UserEntity>

  abstract findUserByEmail(
    tx: PCTransaction,
    email: string,
    options: IFindOptions
  ): Promise<UserEntity>

  abstract findUserByLogin(
    tx: PCTransaction,
    login: string,
    options: IFindOptions
  ): Promise<UserEntity>

  abstract findUserById(
    tx: PCTransaction,
    id: string,
    options: IFindOptions
  ): Promise<UserEntity>

  abstract countUsers(
    tx: PCTransaction,
    { skip, take, ...options }: IPaginationOptions
  ): Promise<number>

  abstract findAllUsersForPagination(
    tx: PCTransaction,
    options: IPaginationOptions
  ): Promise<UserEntity[]>

  abstract findAllUsers(
    tx: PCTransaction,
    options: IFindOptions
  ): Promise<UserEntity[]>

  abstract disableUserById(tx: PCTransaction, id: string): Promise<UserEntity>

  abstract enableUserById(tx: PCTransaction, id: string): Promise<UserEntity>

  abstract deleteUserById(tx: PCTransaction, id: string): Promise<UserEntity>
}
