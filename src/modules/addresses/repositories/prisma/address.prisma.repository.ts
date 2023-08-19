import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaClientTransaction } from '../../../../config/env/prisma/prisma.interface'
import { AddressEntity } from '../../entities/address.entity'
import { AddressRepository } from '../address.repository'

@Injectable()
export class AddressPrismaRepository implements AddressRepository {
  async create(
    tx: PrismaClientTransaction,
    data: Prisma.AddressUncheckedCreateInput
  ): Promise<AddressEntity> {
    return await tx.address.create({ data })
  }
}
