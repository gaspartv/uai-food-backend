import { Prisma } from '@prisma/client'
import { PCTransaction } from '../../../config/env/prisma/prisma.interface'
import { AddressEntity } from '../entities/address.entity'

export abstract class AddressRepository {
  abstract create(
    tx: PCTransaction,
    data: Prisma.AddressUncheckedCreateInput
  ): Promise<AddressEntity>
}
