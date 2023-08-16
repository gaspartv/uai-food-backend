import { Injectable } from '@nestjs/common'
import { PCTransaction } from '../../config/env/prisma/prisma.interface'
import { CreateAddressDto } from './dto/create-address.dto'
import { AddressRepository } from './repositories/address.repository'

@Injectable()
export class AddressesService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async create(tx: PCTransaction, createAddressDto: CreateAddressDto) {
    return await this.addressRepository.create(tx, createAddressDto)
  }
}
