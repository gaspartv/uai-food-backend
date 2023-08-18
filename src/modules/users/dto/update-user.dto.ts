import { PartialType } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { CreateAddressDto } from '../../addresses/dto/create-address.dto'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Exclude()
  address: CreateAddressDto
}
