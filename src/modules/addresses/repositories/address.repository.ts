import { Prisma } from '@prisma/client'
import { PrismaClientTransaction } from '../../../config/prisma/prisma.interface'
import { AddressEntity } from '../entities/address.entity'

export abstract class AddressRepository {
  abstract createAddress(
    tx: PrismaClientTransaction,
    data: Prisma.AddressUncheckedCreateInput
  ): Promise<AddressEntity>

  abstract updateAddress(
    tx: PrismaClientTransaction,
    id: string,
    data: Prisma.AddressUncheckedUpdateInput
  ): Promise<AddressEntity>

  abstract findAddressById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<AddressEntity | null>
}
