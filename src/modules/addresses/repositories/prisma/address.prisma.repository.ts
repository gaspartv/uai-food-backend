import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaClientTransaction } from '../../../../config/prisma/prisma.interface'
import { AddressEntity } from '../../entities/address.entity'
import { AddressRepository } from '../address.repository'

@Injectable()
export class AddressPrismaRepository implements AddressRepository {
  async createAddress(
    tx: PrismaClientTransaction,
    data: Prisma.AddressUncheckedCreateInput
  ): Promise<AddressEntity> {
    return await tx.address.create({ data })
  }

  async updateAddress(
    tx: PrismaClientTransaction,
    id: string,
    data: Prisma.AddressUncheckedUpdateInput
  ): Promise<AddressEntity> {
    return await tx.address.update({ where: { id }, data })
  }

  async findAddressById(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<AddressEntity | null> {
    return await tx.address.findUnique({ where: { id } })
  }
}
