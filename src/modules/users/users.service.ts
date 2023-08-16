import { Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import {
  IOptionsFind,
  IOptionsFindMany
} from '../../common/interfaces/options-repository.interface'
import { PCTransaction } from '../../config/env/prisma/prisma.interface'
import { EnvService } from '../../config/env/service.env'
import { AddressesService } from '../addresses/addresses.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserRepository } from './repositories/user.repository'

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly addressesService: AddressesService,
    private readonly envService: EnvService
  ) {}

  async create(
    tx: PCTransaction,
    { address, password, ...createUserDto }: CreateUserDto
  ) {
    console.log(address)
    const addressCreate = await this.addressesService.create(tx, address)

    const password_hash = await hash(
      password,
      Number(this.envService.env.HASH_SALT)
    )

    return await this.userRepository.create(tx, {
      ...createUserDto,
      password_hash,
      addressId: addressCreate.id
    })
  }

  async findAllPagination(tx: PCTransaction, options: IOptionsFindMany) {
    return await this.userRepository.findAllPagination(tx, options)
  }

  async findAll(tx: PCTransaction, options: IOptionsFind) {
    return await this.userRepository.findAll(tx, options)
  }

  async findOne(tx: PCTransaction, id: string, options: IOptionsFind) {
    return await this.userRepository.find(tx, id, options)
  }

  async update(tx: PCTransaction, id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(tx, id, updateUserDto)
  }

  async delete(tx: PCTransaction, id: string) {
    return await this.userRepository.delete(tx, id)
  }
}
