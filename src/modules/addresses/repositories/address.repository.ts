import { Prisma } from '@prisma/client'
import { PrismaClientTransaction } from '../../../config/env/prisma/prisma.interface'
import { AddressEntity } from '../entities/address.entity'

export abstract class AddressRepository {
  abstract create(
    tx: PrismaClientTransaction,
    data: Prisma.AddressUncheckedCreateInput
  ): Promise<AddressEntity>
}
