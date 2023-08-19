import { Prisma } from '@prisma/client'
import { PrismaClientTransaction } from '../../../config/env/prisma/prisma.interface'
import { UserEntity } from '../entities/user.entity'
import {
  IFindOptions,
  IPaginationOptions
} from '../interfaces/options.interface'

export abstract class UserRepository {
  abstract createUser(
    tx: PrismaClientTransaction,
    data: Prisma.UserUncheckedCreateInput
  ): Promise<UserEntity>

  abstract updateUserById(
    tx: PrismaClientTransaction,
    id: string,
    data: Prisma.UserUncheckedUpdateInput
  ): Promise<UserEntity>

  abstract findUserByEmail(
    tx: PrismaClientTransaction,
    email: string,
    options: IFindOptions
  ): Promise<UserEntity>

  abstract findUserByLogin(
    tx: PrismaClientTransaction,
    login: string,
    options: IFindOptions
  ): Promise<UserEntity>

  abstract findUserById(
    tx: PrismaClientTransaction,
    id: string,
    options: IFindOptions
  ): Promise<UserEntity>

  abstract countUsers(
    tx: PrismaClientTransaction,
    { skip, take, ...options }: IPaginationOptions
  ): Promise<number>

  abstract findAllUsersForPagination(
    tx: PrismaClientTransaction,
    options: IPaginationOptions
  ): Promise<UserEntity[]>

  abstract findAllUsers(
    tx: PrismaClientTransaction,
    options: IFindOptions
  ): Promise<UserEntity[]>

  abstract disableUserById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<UserEntity>

  abstract enableUserById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<UserEntity>

  abstract deleteUserById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<UserEntity>
}
