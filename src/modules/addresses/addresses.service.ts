import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaClientTransaction } from '../../config/prisma/prisma.interface'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'
import { AddressEntity } from './entities/address.entity'
import { AddressRepository } from './repositories/address.repository'

@Injectable()
export class AddressesService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async createAddress(
    tx: PrismaClientTransaction,
    dto: CreateAddressDto
  ): Promise<AddressEntity> {
    return await this.addressRepository.createAddress(tx, dto)
  }

  async updateAddress(
    tx: PrismaClientTransaction,
    id: string,
    dto: UpdateAddressDto
  ): Promise<AddressEntity> {
    await this.findAddressByIdOrThrow(tx, id)
    return await this.addressRepository.updateAddress(tx, id, dto)
  }

  async findAddressByIdOrThrow(
    tx: PrismaClientTransaction,
    id: string
  ): Promise<AddressEntity | null> {
    const address = await this.addressRepository.findAddressById(tx, id)
    if (!address) throw new NotFoundException('Address not found.')
    return address
  }
}
